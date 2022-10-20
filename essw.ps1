if($args[0] -eq "start") {
	if(-not(Test-Path -Path .env -PathType Leaf)) {
		Write-Output "Environment file doesn't exist, type 'essw setup' to setup the environment."
	}
	else {
		Write-Output "Building docker application"
		if(($args[1] -eq "-d") -or ($args[1] -eq "--dev")) {
			docker compose build
			docker compose up
		} else {
			docker compose build --quiet
			docker compose up -d
		}
	}
} elseif($args[0] -eq "stop") {
	docker compose stop
} elseif($args[0] -eq "setup") {
	if(-not(Test-Path -Path .env -PathType Leaf)) {
		Copy-Item example.env .env
		$hostname = Read-Host "Enter hostname"
		(Get-Content .env) -replace '(HOST_NAME=.*)', "HOST_NAME=$hostname" | Set-Content .env
	} elseif($args[1] -eq "-o" -or $args[1] -eq "--override") {
		$confirmation = Read-Host "Confirm override of .env file (y/N)"
		if($confirmation -eq "Y" -or $confirmation -eq "y") {
			Copy-Item example.env .env
			$hostname = Read-Host "Enter hostname"
			(Get-Content .env) -replace '(HOST_NAME=.*)', "HOST_NAME=$hostname" | Set-Content .env
		} else {
			Write-Output "Override not confirmed, cancelling command"
		}
	} else {
		Write-Output ".env file already exists, please use -o or --override to override the file"
	}
} elseif($args[0] -eq "status"){
	docker compose ps
} elseif($args[0] -eq "cleanup"){
	docker compose rm --force --stop --volumes
	Remove-Item .env
} elseif($args[0] -eq "help") {
	Write-Output "---------------------------"
	Write-Output "|ESSW - Script Application|"
	Write-Output "---------------------------"
	if($args[1] -eq "start") {
		Write-Output " Options for start."
		Write-Output " 1. -d or --dev			- starts application with an output from docker"

	} elseif($args[1] -eq "stop") {
		Write-Output " Options for stop."
	} elseif($args[1] -eq "setup") {
		Write-Output " Options for setup."
		Write-Output " 1. -o or --override		- If .env file already exists the override flag will write over the current file"
	} elseif($args[1] -eq "status") {
		Write-Output " Options for status."
	} elseif($args[1] -eq "cleanup") {
		Write-Output " Options for status."
	} else {
		Write-Output " For more options for each command, type 'essw help <command>'."
		Write-Output " 1. start			- Builds container and starts application"
		Write-Output " 2. stop			- Stops application"
		Write-Output " 3. setup			- Sets up environment variables for the application"
		Write-Output " 4. status		- Gets status of docker containers"
		Write-Output " 4. cleanup		- Removes the docker containers and deletes the environment file"
	}
} else {
	Write-Output "Unknown command, type 'essw help' to list commands."
}
