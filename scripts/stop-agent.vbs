Set objWMIService = GetObject("winmgmts:\\\\.\\root\\cimv2")
Set colProcessList = objWMIService.ExecQuery("SELECT * FROM Win32_Process WHERE Name = 'agent.exe'")
For Each objProcess in colProcessList
    objProcess.Terminate
Next
