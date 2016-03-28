# SWEN303 Mini Project Colenso

$ git clone https://github.com/johndaviesco/SWEN303-Mini-Project-Colenso.git
$ wget http://files.basex.org/releases/8.4.1/BaseX841.zip
$ unzip BaseX841.zip
$ rm BaseX841.zip
$ sudo apt-get install unzip
$ mkdir Colenso
$ cd Colenso
$ wget http://ecs.victoria.ac.nz/foswiki/pub/Courses/SWEN303_2016T1/Assignments/Colenso_TEIs.zip
$ unzip Colenso_TEIs.zip
$ rm Colenso_TEIs.zip
$ cd ..
$ basex/bin/basexserver -d -c"CREATE DATABASE Colenso ./SWEN303MiniProject/Colenso"

To run the xbase database again

$ basex/bin/basexserver -d
