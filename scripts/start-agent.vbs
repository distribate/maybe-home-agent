Set objWMIService = GetObject("winmgmts:\\.\root\cimv2")
If Err.Number <> 0 Then
    WScript.Quit
End If

Set WshShell = CreateObject("WScript.Shell")

scriptFullPath = WScript.ScriptFullName

Set fso = CreateObject("Scripting.FileSystemObject")
scriptFolder = fso.GetParentFolderName(scriptFullPath)

exePath = fso.BuildPath(fso.GetParentFolderName(scriptFolder), "agent.exe")

Set colProcessList = objWMIService.ExecQuery("SELECT * FROM Win32_Process WHERE Name = 'agent.exe'")
If colProcessList.Count = 0 Then
    WshShell.Run Chr(34) & exePath & Chr(34), 0, False
End If