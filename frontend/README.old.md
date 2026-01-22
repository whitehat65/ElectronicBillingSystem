Frontend scaffold failed inside the environment due to PowerShell execution policy or missing Node.js. Please create the React app manually by running in PowerShell:

1. Open PowerShell as Administrator and run: Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
2. cd /d D:\Prashant\ElectronicBillingSystem\frontend
3. npx create-react-app . --template cra-template

Or install Node.js from https://nodejs.org and re-run the commands above.
