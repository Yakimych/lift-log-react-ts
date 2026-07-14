param (
  [Parameter(Mandatory = $false)][string]$baseurl = "/api"
)

Set-Content -Path .env -Value "REACT_APP_API_BASE_URL=$($baseurl)"
