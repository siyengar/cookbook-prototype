import httplib

segmentserviceurl = 'donottrack.us'
segmentservice = httplib.HTTPConnection(segmentserviceurl, 80)
requestString = '/cookbook/prototype/profiler/categorize.py/main?url=' + 'http://google.com'
segmentservice.request('GET', requestString)
response = segmentservice.getresponse()
print response.status
print response.read()

