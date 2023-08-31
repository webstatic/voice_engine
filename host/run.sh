
#!/bin/bash

echo "start"


wget https://github.com/VOICEVOX/voicevox_core/releases/download/0.14.4/voicevox_core-linux-arm64-cpu-0.14.4.zip
unzip voicevox_core-linux-arm64-cpu-0.14.4.zip
rm voicevox_core-linux-arm64-cpu-0.14.4.zip

mv voicevox_core-linux-arm64-cpu-0.14.4 voicevox_core
cd voicevox_core

wget https://github.com/microsoft/onnxruntime/releases/download/v1.13.1/onnxruntime-linux-aarch64-1.13.1.tgz
tar zxvf onnxruntime-linux-aarch64-1.13.1.tgz
ln -s onnxruntime-linux-aarch64-1.13.1/lib/libonnxruntime.so.1.13.1
rm onnxruntime-linux-aarch64-1.13.1.tgz

wget https://jaist.dl.sourceforge.net/project/open-jtalk/Dictionary/open_jtalk_dic-1.11/open_jtalk_dic_utf_8-1.11.tar.gz
tar xzvf open_jtalk_dic_utf_8-1.11.tar.gz
rm open_jtalk_dic_utf_8-1.11.tar.gz
