@echo off
SETLOCAL

SET "AGENT_PATH=%~dp0..\agent.exe"
SET "START_VBS=%~dp0start-agent.vbs"
SET "STOP_VBS=%~dp0stop-agent.vbs"

SET "TASK_NAME_START=HomeAgent"
SET "TASK_NAME_STOP=StopHomeAgent"

schtasks /Query /TN "%TASK_NAME_START%" >nul 2>&1
if %ERRORLEVEL%==0 schtasks /Delete /TN "%TASK_NAME_START%" /F

schtasks /Query /TN "%TASK_NAME_STOP%" >nul 2>&1
if %ERRORLEVEL%==0 schtasks /Delete /TN "%TASK_NAME_STOP%" /F

echo Registering start task...
schtasks /Create /TN "%TASK_NAME_START%" /TR "wscript.exe \"%START_VBS%\" \"%AGENT_PATH%\"" /SC ONLOGON /RU "%USERNAME%" /RL HIGHEST /F /IT

echo Registering stop task...
schtasks /Create /TN "%TASK_NAME_STOP%" /TR "wscript.exe \"%STOP_VBS%\" \"%AGENT_PATH%\"" /SC ONCE /ST 00:00 /RU "%USERNAME%" /F

echo Starting HomeAgent now...
schtasks /Run /TN "%TASK_NAME_START%"

echo Done! HomeAgent setup complete.
pause