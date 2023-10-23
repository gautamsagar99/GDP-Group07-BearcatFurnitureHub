#!/bin/sh
# wait-for-nodeapp.sh

# Wait for the nodeapp service to become available
sleep 2m

# Run your SQL script inside the MySQL container
docker exec -i backend-mysql-1 mysql -uroot -proot bearcathub < /sample/furnitures.sql
echo "Completed the script"
