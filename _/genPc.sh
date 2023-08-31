echo -n "こんにちは、音声合成の世界へようこそ" >text.txt

echo "start audio_query"
curl -s \
    -X POST \
    "192.168.1.15:50021/audio_query?speaker=47"\
    --get --data-urlencode text@text.txt \
    > query.json

echo "start synthesis"

curl -s \
    -H "Content-Type: application/json" \
    -X POST \
    -d @query.json \
    "192.168.1.15:50021/synthesis?speaker=47" \
    > out.wav

