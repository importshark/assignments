import sys
import struct

if len(sys.argv) < 4:
    print("Change Exe Run Mode Application by burlachenkok@gmail.com\nNot sufficient parametrs. 'exe_src_name.exe' 'exe_dest_name.exe' 'to_console' or 'to_windows'")
    sys.exit(-1)

source = open(sys.argv[1], "rb")
dest   = open(sys.argv[2], "w+b")
dest.write(source.read())

dest.seek(0x3c)
(PeHeaderOffset,)=struct.unpack("H", dest.read(2))

dest.seek(PeHeaderOffset)
(PeSignature,)=struct.unpack("I", dest.read(4))
if PeSignature != 0x4550:
    print("Error in Find PE header")

dest.seek(PeHeaderOffset + 0x5C)

if sys.argv[3].strip() == "to_console":
    # console mode
    dest.write(struct.pack("H", 0x03))
elif sys.argv[3].strip() == "to_windows":
    # window mode
    dest.write(struct.pack("H", 0x02))
else:
    print("Wrong Format: '" + sys.argv[3] + "'")

source.close()
dest.close()

print("Completed succesfully..")