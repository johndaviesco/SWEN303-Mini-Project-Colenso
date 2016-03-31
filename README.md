# SWEN303 Mini Project Colenso

Dependencies
  -Nodejs
  -Java 7
  -unzip

```sh

mkdir Colenso

cd Colenso

wget http://ecs.victoria.ac.nz/foswiki/pub/Courses/SWEN303_2016T1/Assignments/Colenso_TEIs.zip

unzip Colenso_TEIs.zip

rm Colenso_TEIs.zip

cd ..

wget http://files.basex.org/releases/8.4.1/BaseX841.zip

unzip BaseX841.zip

rm BaseX841.zip

git clone https://github.com/johndaviesco/SWEN303-Mini-Project-Colenso.git

cd SWEN303-Mini-Project-Colenso/

npm install

cd ..

basex/bin/basexserver -d -c"CREATE DATABASE Colenso ./Colenso"

cd SWEN303-Mini-Project-Colenso/

npm start app.js
```
To run the XBase database again as a one off instance
```sh
basex/bin/basexserver -d
```
