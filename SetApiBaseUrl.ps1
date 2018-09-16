param (
  [Parameter(Mandatory = $false)][string]$baseurl = "http://localhost:5000/api"
)

Set-Content -Path .env -Value "REACT_APP_API_BASE_URL=$($baseurl)"