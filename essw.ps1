if($args[0] -eq "start"){
	Copy-Item example.env .env
	Write-Output "Building docker application"
	if(($args[1] -eq "-d") -or ($args[1] -eq "--dev")){
		docker compose build
		docker compose up
	} else {
		docker compose build --quiet
		docker compose start
	}
} elseif($args[0] -eq "stop"){
	docker compose stop
} elseif($args[0] -eq "help"){
	Write-Output "---------------------------"
	Write-Output "|ESSW - Script Application|"
	Write-Output "---------------------------"
	if($args[1] -eq "start") {
		Write-Output " Options for start."
		Write-Output " 1. -d or --dev			- starts application with an output from docker"

	} elseif($args[1] -eq "stop") {
		Write-Output " Options for stop."
	} else {
		Write-Output " For more options for each command, type 'essw help <command>'."
		Write-Output " 1. start			- Builds container and starts application"
		Write-Output " 2. stop			- Stops application"
	}
}else {
	Write-Output "Unknown command, type 'essw help' to list commands."
}
