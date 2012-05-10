#! /usr/bin/python
"""
This is a part of the WSGI configuration
framework I created to easily deploy 
applications

https://github.com/siyengar/flowise
"""


import xml.dom.minidom
import wsgiref
import sys

class MethodObj:
	def __init__(self, methodobj, params):
		self.methodobj = methodobj
		self.params = params
	def __call__(self):
		self.methodobj(**self.params)

class Deployment:
	def __init__(self, methodObjList):
		self.methodObjList = methodObjList
	def deploy(self):
		for method in self.methodObjList:
			method()		

def getAttribute(node, attr):
	attrNode = node.getAttributeNode(attr)
	return getText(attrNode)

def getText(node):
	try:
		for childNode in node.childNodes:
			if childNode.nodeType == childNode.TEXT_NODE:
				return childNode.data
	except:
		return ''

def makeParams(paramsNode):
	params = {}
	applicationKey = False	
	for param in paramsNode.getElementsByTagName("param"):
		paramName = getAttribute(param, "name")
		paramValue = getAttribute(param, "value")
		paramType = getAttribute(param, "type")
		if paramValue == '$application':
			applicationKey = paramName	
		if paramType == 'int':	
			paramValue = int(paramValue)
		params[paramName] = paramValue
			
	return params, applicationKey

def getMethodObj(module, methodConfig):
	methodName = getText(methodConfig.getAttributeNode("name"))
	methodobj = getattr(module, methodName)
	paramsNode = methodConfig.getElementsByTagName("params")[0]	
	params = makeParams(paramsNode)
	method = MethodObj(methodobj, params)
	return method

def parseDeploymentConfigFile(deploymentConfigFile):
	deploymentConfigDom = xml.dom.minidom.parse(deploymentConfigFile)
	configNode = deploymentConfigDom.getElementsByTagName("config")[0]
	configType = getText(configNode.getElementsByTagName("type")[0])
	runNode = configNode.getElementsByTagName("run")[0]

	serverMethodNode = runNode.getElementsByTagName("server")[0]
	serverMethodParamNode = serverMethodNode.getElementsByTagName("params")[0]	

	serverMethodName = getAttribute(serverMethodNode, "name")

	startMethodNode = runNode.getElementsByTagName("start")[0]
	startMethodName = getAttribute(startMethodNode, "name")
	try:
		startMethodParamNode = startMethodNode.getElementsByTagName("params")[0]	
	except:
		startMethodParamNode = deploymentConfigDom.createElement("params")
	serverMethodParams = makeParams(serverMethodParamNode)
	startMethodParams = makeParams(startMethodParamNode)
	
	return configType, serverMethodName, serverMethodParams, startMethodName, startMethodParams
		
def getDeployment(dom, application):
	deploymentElement = dom.getElementsByTagName("deployment")[0]
	configElement = deploymentElement.getElementsByTagName("config")[0]
	deploymentConfigFile = getText(configElement)
	configType, serverMethodName, serverMethodParams, \
			startMethodName, startMethodParams = \
					parseDeploymentConfigFile(deploymentConfigFile)

	if serverMethodParams[1]:
		serverMethodParams[0][serverMethodParams[1]] = application

	if startMethodParams[1]:
		startMethodParams[0][startMethodParams[1]] = application

	__import__(configType)
	moduleObj = sys.modules[configType]
	serverMethodObj = getattr(moduleObj, serverMethodName)
	httpd = serverMethodObj(**serverMethodParams[0])
		
	startObj = MethodObj(getattr(httpd, startMethodName), startMethodParams[0])
	deployment = Deployment([startObj])
	return deployment

def getApplication(dom):
	imports = []
	applicationElement = dom.getElementsByTagName("application")[0]
	stageElements = applicationElement.getElementsByTagName("stage")
	for stageElement in stageElements:
		moduleElement = stageElement.getElementsByTagName("module")[0]
		module = getText(moduleElement)
		appElement = stageElement.getElementsByTagName("app")[0]
		appName = getText(appElement)
		__import__(module)
		imports.append((module, appName))
	application = False
	for i in range(-1, -len(imports) - 1, -1):
		importedModule = imports[i]
		moduleObj = sys.modules[importedModule[0]]
		app = getattr(moduleObj, importedModule[1])
		if not application:
			application = app()
		else:
			application = app(application)
	return application		
				
def main(configFile):
	dom = xml.dom.minidom.parse(configFile)
	app_config = dom.getElementsByTagName("app-config")[0]
	application = getApplication(app_config)	
	deployment = getDeployment(app_config, application)
	deployment.deploy()
if __name__ == '__main__':
	if len(sys.argv) < 2:
		print('correct use is: runapp.py config_file.xml')
	else:
		main(sys.argv[1])
