import pymongo
import os
import re
import Cheetah.Template
import json
import bson.json_util
import httplib

"""
This is the file for the ad network server. 
It uses the WSGI framework.

@author Subodh Iyengar
"""


"""
The File Server class encapsulates file serving 
functionality and also sets the MIME type 
of the response. It also sandboxes the files 
only in rootdir.
"""

# files are in the cheetah template format
class FileServer:
  def __init__(self, rootdir):
    self.rootdir = rootdir
  """
  Checks whether the path is within the rootdir path after 
  resolution
  """
  def checkPath(self, path):
    absPath = os.path.abspath(path)
    retval = True if (self.rootdir in absPath) else False
    return retval

  """
  Handles fetching of files that are of the image
  type.
  """
  def getImageContents(self,  fileName):
    relativeFilePath = self.rootdir + fileName
    contents = ''
    if not self.checkPath(relativeFilePath):
      return ''
    if os.path.exists(relativeFilePath):
      fileObject = open(relativeFilePath, 'rb')
      # TODO: maybe return an iterator
      contents = fileObject.read()  
      fileObject.close()
    return contents

  """
  Handles fetching of files that are of the text
  type.
  """
  def getFileContents(self,  fileName):
    relativeFilePath = self.rootdir + fileName
    if not self.checkPath(relativeFilePath):
      return ''
    contents = ''
    if os.path.exists(relativeFilePath):
      fileObject = open(relativeFilePath, 'rU')
      # TODO: maybe return an iterator
      contents = fileObject.read()  
      fileObject.close()
    return contents
  
  """
  Processes files given data
  type.
  """
  def processFile(self, fileName, replace):
    relativeFilePath = self.rootdir + fileName
    if not self.checkPath(relativeFilePath):
      return ''
    if os.path.exists(relativeFilePath):
      result = Cheetah.Template.Template(file = relativeFilePath, searchList = [replace])
      return str(result)
    return 'Sorry no donut for you'


"""
This is the main class for the AdServer.
It responds to commands from the URL
"""

class AdServer:
  def __init__(self):
    # connector for mongoDB
    self.connection = pymongo.Connection('localhost', 27017)
    self.db = self.connection.ads
    self.rootdir = 'rootdir/'
    self.pathpattern = re.compile(r'/(.*?)/')  
    self.response_headers = [('Content-Type', 'text/html')]
    self.OK = '200 OK'
    self.BAD = '400 Bad Request'
    self.files = FileServer(self.rootdir)
    self.segmentserviceurl = 'donottrack.us'
    try:
      self.segmentservice = httplib.HTTPConnection(self.segmentserviceurl, 80)
    except:
      print 'connection to segment service failed, using db'
      self.segmentservice = False
    # path to the segment provider service
    self.requesturl = '/cookbook/prototype/profiler/categorize.py/main?url='
    self.servicecache = {}

  def __call__(self, environment, start_response):  
    self.response_headers = [('Content-Type', 'text/html')]
    response_body = self.processAction(environment)
    len_response = len(response_body)
    start_response(self.OK, self.response_headers) 
    return [response_body]

  """
  Processes the request. Based on the method name in 
  the URL, it dispatches control to one of many 
  action methods
  """
  def processAction(self, environment):
    path = environment['PATH_INFO']
    match = self.pathpattern.search(path)
    response_body = ''
    if match:
      action = match.group(1)
      if action == 'retarget':
        match = re.search(r'/(.*?)/(.*?)/', path)
        if match:
          campaignid = match.group(2)
          response_body = self.doRetarget(environment, campaignid)
      elif action == 'getads':  
        response_body = self.doGetAds(environment)
      elif action == 'getad':  
        response_body = self.doGetAd(environment, path)
      elif action == 'track':
        return self.doTrack(environment, path)
      elif action == 'advertiser':
        return self.advertiser(path)
      elif action == 'publisher':
        return self.publisher(path)
      elif action == 'purge':
        return self.doPurgeLocalStorage()
      elif action == 'blank':
        return self.doBlank()
      elif action == 'demo':
        return self.doDemo()
      elif action == 'trackinfo':
        return self.doTrackInfo(environment)
      elif action == 'adchoices':
        return self.doAdChoice()
          
    return response_body

  """
  Performs the retargeting action: 
    Gets all the ads for the campaign from the database
    and returns the page retarget.html with the ads
    embedded in it.
  """
  def doRetarget(self, environment, campaignid):
    # TODO: add sanitization
    try:
      campaignid = int(campaignid)
    except Exception:
      return 'badly formatted campaign id'
    campaign = self.getAdsFromDb(campaignid)
    if not campaign:
      return 'no ad'
    
    segments = campaign['segments']
    ads = campaign['ads']
    result = []
    for ad in ads:
      ad['segments'] = segments
      result.append(ad)
    jsonResult = json.dumps(result, default = bson.json_util.default)
    replace = {'json': jsonResult}
    return self.files.processFile('retarget.html', replace)

  """
  Returns the ads that are not related to retargeting.
  """  
  def getNormalAds(self):  
    adtable = self.db.advertisers
    query = {'campaigns.type': 'normal'}
    results = adtable.find(query) 
    maxNormalAds = 2
    normalAds = []
    for advertiser in results:
      for campaign in advertiser['campaigns']:
        if campaign['type'] == 'normal':
          segments = campaign['segments']
          for ad in campaign['ads']:
            maxNormalAds -= 1
            ad['segments'] = segments
            normalAds.append(ad)
            if not maxNormalAds: return normalAds
    return normalAds

  """
  Downloads the page getads which initiates the 
  bidding process within the browser. 
  """
  def doGetAds(self, environment):
    normalAds = self.getNormalAds()
  
    jsonads = json.dumps(normalAds, default = bson.json_util.default)
    replace = {'normalads': jsonads}
    return self.files.processFile('getads.html', replace)

  def doGetAd(self, environment, path):  
    match = re.search(r'/(.*?)/(.*?)/', path)
    if match:
      adid = match.group(2);  
      url = self.getAdUrl(adid)
      replace = {'url': url, 'adid': adid}
      return self.files.processFile('getad.html', replace)
    return 'no ad'

  """
  Returns the tracking page, which tracks the user 
  preferences from within the browser.
  """
  def doTrack(self, environment, path):
    referrer = environment.get('HTTP_REFERER', '')
    if referrer == '':
      return 'no segment'
    #segmentJSON = self.getSegmentsFromService(referrer)
    match = re.search(r'/(.*?)/(.*)/', path)
    if match:
      referrer = 'http://' + match.group(2)
    else:
      return ''
    segmentJSON = self.getSegmentsFromService(referrer)
    print 'printing segments'
    print segmentJSON
    if segmentJSON != '':
      replace = {'segments' : segmentJSON}
      return self.files.processFile('track.html', replace)
    return 'no segment'

  """
  Returns the page which summarizes all the tracking data
  stored about the user within the browser.
  """
  def doTrackInfo(self, environment):
    referrer = environment.get('HTTP_REFERER', '')
    segments = self.getSegmentsFromService(referrer)
    replace = {'segments' : segments}
    return self.files.processFile('trackprofile.html', replace)

  
  """
  Demo page
  """
  def doDemo(self):
    return self.files.getFileContents('demo.html')

  """
  Gets the segments from the service URL. 
  Not currently in use.
  """

  def getSegmentsFromService(self, referrer):
    segments = self.servicecache.get(referrer, False)
    if segments:
      return segments
    self.segmentservice = httplib.HTTPConnection(self.segmentserviceurl, 80)
    requestString = self.requesturl + referrer
    self.segmentservice.request('GET', requestString)
    response = self.segmentservice.getresponse()
    segmentJSON = response.read()
    # hack to stop a crash on wrong output
    if 'MOD_PYTHON' in segmentJSON:
      return '[]'
    self.servicecache[referrer] = segmentJSON
    return segmentJSON
  

  """
  Get segments for the page referrer which are 
  cached in the database
  """  
  def getSegmentsFromDb(self ,referrer):    
    db = self.db
    segmentdb = db.segments
    query = {'url': referrer}  
    results = segmentdb.find(query)
    for result in results:
      segments = result['segments']
      segmentJSON = json.dumps(segments, default = bson.json_util.default)
      return segmentJSON
    return ''

  """
  Takes as input a campaign id 
  and returns all the ads in the 
  campaign, from the database
  """
  def getAdsFromDb(self, campaignid):
    db = self.db
    adtable = db.advertisers
    campaignid = str(campaignid)
    query = {'campaigns.id' : campaignid}
    results = adtable.find(query)
    for advertiser in results:
      campaigns = advertiser.get('campaigns', [])
      for campaign in campaigns:
        campid = campaign['id']
        if campid == campaignid:
          return campaign  
    return False

  """
  Get a url for a particular adid from the Db
  """  
  def getAdUrl(self, adid):
    db = self.db
    adtable = db.ad
    if adid:
      query = {'id' : adid}
      results = adtable.find(query)
      for ad in results:
        return ad['url']
    return ''


  """
  Not used currently. Inserts the adid into the seen table
  """  
  def insertAdIntoSeenTable(self, ad):
    self.db.seenads.insert(ad)  
  
  """
  Deals with serving up the advertiser pages and content
  and deals with mimetypes
  """
  def advertiser(self, path):
    match = re.search(r'/(.*?)/(.*?)/', path)
    match2 = re.search(r'/(.*?)/(.*?)/(.+)', path)
    content = 'no such advertiser'
    if match2:
      filePath = match2.group(3)
      fullPath = 'advertisers/' + filePath
      lPath = filePath.lower()
      if '.jpg' in lPath or '.png' in lPath or '.jpeg' in lPath or '.gif' in lPath:
        content = self.files.getImageContents(fullPath)
      else:
        content =  self.files.getFileContents(fullPath)
      mimeType = self.getMimeType(path)
      if mimeType:
        self.response_headers = [('Content-Type', mimeType)]
    elif match:  
      try:
        advertiserNumber = int(match.group(2))  
      except:
        return content
      content = self.files.getFileContents('advertisers/' + str(advertiserNumber) + '.html')
    return content
  
  """
  Deals with serving up the publisher pages and content
  and deals with mimetypes
  """
  def publisher(self, path):
    match = re.search(r'/(.*?)/(.*?)/', path)
    match2 = re.search(r'/(.*?)/(.*?)/(.+)', path)
    content = 'no such publisher'
    if match2:
      filePath = match2.group(3)
      fullPath = 'publishers/' + filePath
      lPath = filePath.lower()
      if '.jpg' in lPath or '.png' in lPath or '.jpeg' or '.gif' in lPath:
        content = self.files.getImageContents(fullPath)
      else:
        content =  self.files.getFileContents(fullPath)
      mimeType = self.getMimeType(path)
      if mimeType:
        self.response_headers = [('Content-Type', mimeType)]
    elif match:  
      advertiserNumber = int(match.group(2))  
      content = self.files.getFileContents('publishers/' + str(advertiserNumber) + '.html')
    return content

  """
  Returns the adchoice icon
  """
  def doAdChoice(self):
    self.response_headers = [('Content-Type', 'image/gif')]
    content = self.files.getImageContents('adchoices.gif')
    return content

  """
  Start over
  """
  def doPurgeLocalStorage(self):
    return self.files.getFileContents('purge.html');
  
  def doBlank(self):
    return '';

  def getMimeType(self, path):
    query = path.split('?')
    extIndex = query[0].rfind('.')
    if extIndex == -1:
      return 'text/plain'
    ext = path[extIndex+1: ]
    ext = ext.lower()
    if ext in ['jpg', 'jpeg', 'png', 'gif']:
      return 'image/' + ext;
    elif ext in ['css']:
      return 'text/css'
    elif ext in ['js']:  
      return 'text/javascript'
    return False 
