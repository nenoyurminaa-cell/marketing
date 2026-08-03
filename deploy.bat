@echo off
echo ============================================================
echo  CAK AI PLATFORM - ONE CLICK GITHUB SYNC & PUSH
echo  Repository: nenoyurminaa-cell/marketing
echo ============================================================
echo.

set GIT_PATH="C:\Users\Neno\.gemini\antigravity-ide\scratch\mingit\cmd\git.exe"

%GIT_PATH% remote remove origin >nul 2>&1
%GIT_PATH% remote add origin https://github.com/nenoyurminaa-cell/marketing.git
%GIT_PATH% branch -M main
%GIT_PATH% add -A
%GIT_PATH% commit -m "Update CAK AI Platform changes" >nul 2>&1

echo Mengirim (Push) perubahan ke repository https://github.com/nenoyurminaa-cell/marketing...
%GIT_PATH% push -u origin main

echo.
echo ============================================================
echo  SELESAI! Perubahan berhasil disinkronkan ke GitHub!
echo ============================================================
pause
