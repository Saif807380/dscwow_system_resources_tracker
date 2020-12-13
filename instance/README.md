# Instructions for setting up Instance

1. Make sure Nodejs (>=v14) is installed. To install Node v14x on Debian/Ubuntu based distributions

```bash
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. Download the zip file from our repository

```bash
wget https://github.com/Saif807380/dscwow_system_resources_tracker/raw/main/instance.zip
```

3. Extract zip file to home directory and install node packages

```bash
mkdir ~/instance && unzip instance.zip -d ~/instance
cd ~/instance && npm install
sudo cp -R ~/instance /usr/bin/
```

4. [OPTIONAL] Copy the systemd service file and start the service

```bash
sudo cp monitoring.service /lib/systemd/system/monitoring.service
sudo chmod 644 /lib/systemd/system/monitoring.service
sudo systemctl enable monitoring.service && sudo systemctl start monitoring.service
```

5. Add ingress for port 8000 in your cloud provider network rules

6. Add your public ip address for the instance in the dashboard and monitor your instance!


## Running the example Docker container

1. Clone the repository 
```bash
git clone https://github.com/Saif807380/dscwow_system_resources_tracker.git
```

2. Create the docker image and run it
```bash
docker build -t remote-monitoring .
docker run -it --rm -p 7000:8000 --name run-monitoring remote-monitoring
```

3. Add localhost:7000 in the public IP field in the dashboard to monitor your docker container