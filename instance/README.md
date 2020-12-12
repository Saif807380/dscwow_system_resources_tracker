# Instructions for setting up Instance

1. Make sure Nodejs (>=v14) is installed. To install Node v14x on Debian/Ubuntu based distributions

```bash
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. Download the zip file from our repository

```bash
wget https://github.com/Saif807380/dscwow_system_resources_tracker/blob/main/instance.zip?raw=true
```

3. Extract zip file to home directory and install node packages

```bash
mkdir instance && unzip instance.zip -d ~/instance
sudo chmod +x ~/instance/start.sh
cd ~/instance && npm install
```

4. [OPTIONAL] Copy the systemd service file and start the service

```bash
sudo cp monitoring.service /etc/systemd/system/monitoring.service
sudo chmod 644 /etc/systemd/system/monitoring.service
sudo systemctl enable monitoring.service && sudo systemctl start monitoring.service
```

5. Add ingress for port 8000 in your cloud provider network rules

6. Add your public ip address for the instance in the dashboard and monitor your instance!
