!include "MUI2.nsh"

Outfile "YourAppInstaller.exe"
RequestExecutionLevel user

!define MUI_STARTMENUPAGE_REGISTRY_ROOT "HKCU"
!define MUI_STARTMENUPAGE_REGISTRY_KEY "Software\YourApp"
!define MUI_STARTMENUPAGE_REGISTRY_VALUENAME "Install_Dir"

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_WELCOME
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_UNPAGE_FINISH

Section
  SetOutPath $INSTDIR
  File /r "dist\*.*"
SectionEnd
