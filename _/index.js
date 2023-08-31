console.log('hello');

const koffi = require('koffi');

console.log('start');
// Load the shared library
//const lib = koffi.load('user32.dll');
const lib = koffi.load("./libvoicevox_core.so");

// const printf = lib.func('printf', 'int', ['str', '...']);

// printf("hello libvoicevox_core\n\r")

let VoicevoxInitializeOptions = koffi.struct('VoicevoxInitializeOptions', {
    acceleration_mode: 'int',
    cpu_num_threads: 'uint16_t',
    load_all_models: 'bool',
    open_jtalk_dict_dir: 'str'
});

let VoicevoxTtsOptions = koffi.struct('VoicevoxTtsOptions', {
    kana: 'bool',
    enable_interrogative_upspeak: 'bool'
});


const voicevox_get_version = lib.func('voicevox_get_version', 'str', []);
console.log(voicevox_get_version());

const voicevox_make_default_initialize_options = lib.func('voicevox_make_default_initialize_options', 'VoicevoxInitializeOptions', [])

let voicevox_initialize = lib.func('voicevox_initialize', 'int', ['VoicevoxInitializeOptions']);
//let voicevox_initialize = lib.func('int voicevox_initialize(VoicevoxInitializeOptions options)');
//let voicevox_initialize = lib.func('voicevox_initialize', 'int', ['bool', 'int', 'bool']);


let voicevox_get_metas_json = lib.func('voicevox_get_metas_json', 'char*', []);

let voicevox_get_supported_devices_json = lib.func('voicevox_get_supported_devices_json', 'str', []);
// let voicevox_tts = lib.func('voicevox_tts', 'int', ['str','uint32_t','VoicevoxTtsOptions',]);
let voicevox_tts = lib.func("int voicevox_tts(const char *text, uint32_t speaker_id, VoicevoxTtsOptions options, uintptr_t *output_wav_length, uint8_t **output_wav);");

let voicevox_load_model = lib.func("int voicevox_load_model(uint32_t speaker_id)");

let initialize_options = voicevox_make_default_initialize_options();

initialize_options.cpu_num_threads = 4
initialize_options.load_all_models = true;
initialize_options.open_jtalk_dict_dir = 'open_jtalk_dic_utf_8-1.11'
console.log(initialize_options);

let result = voicevox_initialize(initialize_options)
console.log('voicevox_initialize', result);

// let a = 0
// let b = 0


// voicevox_tts("として不正な入力です", 2, {
//     kana: false,
//     enable_interrogative_upspeak: false
// }, a, b)

//console.log(voicevox_get_metas_json());
// console.log('voicevox_load_model', voicevox_load_model(2));

//let result = voicevox_initialize(false, 4, false)

//console.log(initialize_options, result);

//console.log(voicevox_get_supported_devices_json());
