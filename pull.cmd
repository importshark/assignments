"./data/docker.exe" pull importshark/assignments

cd exercises
for /F %%x in ('dir /B /D') do (
	cd %%x\
	"../../data/node/kickstarter/npm.cmd" install
	cd ..

)
