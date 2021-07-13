const zlib = require('zlib');
const fs = require('fs')

const sprintf = require('sprintf-js').sprintf

const substr_count = (S, search) => { return S.split(search).length - 1; }

const strtolower = (str) => { return str.toLowerCase() }

const strtoupper = (str) => { return str.toUpperCase() }

const str_replace = (searchvalue, newvalue, from) => { return from.replace(searchvalue, newvalue) }

const strlen = (str) => { 
    str=`${str}`
    return str.length 
}

const is_string = (xValue) => { return (typeof xValue === 'string') }

const isset = (xValue) => { return (typeof xValue !== 'undefined') }

const strpos = (str, searchvalue) => { 
    str=`${str}`
    return str.indexOf(searchvalue) 
}

const substr = (str, start, length=undefined) => {
    str=`${str}`
    if (str&&start>=0) {
        return str.substr(start, length)
    }else if(str&&start<0){
      return str.substr(start,length) 
    } else {
        return ''
    }

}

const method_exists = (obj, method) => {

    if (method in obj) {
        return typeof obj[method] === 'function'
    } else {
        return false
    }

}

const chr = (charCode) => { return String.fromCharCode(charCode) }

const is_array = (obj) => { return Array.isArray(obj) }

const in_array = (key, obj) => {

    if (Array.isArray(obj)) {
        return obj.includes(key)
    } else {
        return (key in obj)
    }

}

const function_exists = (cModule) => {

    try {
        const test = require(cModule)
        return true
    } catch (error) {
        return false
    }

}

const count = (obj) => {

    if (Array.isArray(obj)) {
        return obj.length
    } else if (typeof obj === 'object') {
        return Object.keys(obj).length
    } else {
        return 0
    }

}

const ord = (string) => {
    //  discuss at: https://locutus.io/php/ord/
    // original by: Kevin van Zonneveld (https://kvz.io)
    // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
    // improved by: Brett Zamir (https://brett-zamir.me)
    //    input by: incidence
    //   example 1: ord('K')
    //   returns 1: 75
    //   example 2: ord('\uD800\uDC00'); // surrogate pair to create a single Unicode character
    //   returns 2: 65536

    var str = string + ''
    var code = str.charCodeAt(0)

    if (code >= 0xD800 && code <= 0xDBFF) {
        // High surrogate (could change last hex to 0xDB7F to treat
        // high private surrogates as single characters)
        var hi = code
        if (str.length === 1) {
            // This is just a high surrogate with no following low surrogate,
            // so we return its value;
            return code
            // we could also throw an error as it is not a complete character,
            // but someone may want to know
        }
        var low = str.charCodeAt(1)
        return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000
    }
    if (code >= 0xDC00 && code <= 0xDFFF) {
        // Low surrogate
        // This is just a low surrogate with no preceding high surrogate,
        // so we return its value;
        return code
        // we could also throw an error as it is not a complete character,
        // but someone may want to know
    }

    return code
}

const gzcompress = (data) => {
    const chunk = (!Buffer.isBuffer(data)) ? Buffer.from(data, 'binary') : data
    return zlib.deflateSync(chunk)
}

const gzuncompress = (data) => {
    const chunk = (!Buffer.isBuffer(data)) ? Buffer.from(data, 'binary') : data
    const Z1 = zlib.inflateSync(chunk)
    return Z1.toString('binary')//'ascii'
}

const file = (cFile) => {

    try {

        const data = fs.readFileSync(cFile);
        if (!data) {
            return;
        } else {
            return data
        }

    } catch (error) {
        return null
    }

}

const rtrim = (str, chars = ' ') => {
    // creditos de la funcion
    //https://github.com/sergejmueller/rtrim
    // Convert to string
    str = str.toString();

    // Empty string?
    if (!str) {
        return '';
    }

    // Remove whitespace if chars arg is empty
    if (!chars) {
        return str.replace(/\s+$/, '');
    }

    // Convert to string
    chars = chars.toString();

    // Set vars
    var letters = str.split(''),
        i = letters.length - 1;

    // Loop letters
    for (i; i >= 0; i--) {
        if (chars.indexOf(letters[i]) === -1) {
            return str.substring(0, i + 1);
        }
    }

    return str;

};

const explode = (search, from) => {

    return from.split(search)

}

const hexdec = (hexString) => {
    //  discuss at: https://locutus.io/php/hexdec/
    // original by: Philippe Baumann
    //   example 1: hexdec('that')
    //   returns 1: 10
    //   example 2: hexdec('a0')
    //   returns 2: 160

    hexString = (hexString + '').replace(/[^a-f0-9]/gi, '')
    return parseInt(hexString, 16)
}

const round = (number) => {
    return Math.round(number);
}

const fopen= (filename) =>{
    try {
        return fs.openSync(filename) 
    } catch (error) {
        return null  
    }
    
}

const fclose = (f) =>{
    return fs.closeSync(f)
}

const fread = (f,n) =>{
    let buffer =Buffer.alloc ? Buffer.alloc(n) : new Buffer(n);
    let read = fs.readSync(f, buffer, 0, n);
    return buffer
}

const fseek = (f,n,position='SEEK_CUR') =>{
    
    let buffer =Buffer.alloc ? Buffer.alloc(n) : new Buffer(n);
    const pos=(position==='SEEK_CUR')?null:(position==='SEEK_SET')?0:0
    let read = fs.readSync(f, buffer, 0, n,pos);

    return read
}

const file_get_contents = ()=>{

}

const strtr = (str, from, to) => {
    // http://kevin.vanzonneveld.net
    // +   original by: Brett Zamir (http://brett-zamir.me)
    // +      input by: uestla
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Alan C
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Taras Bogach
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // +      input by: jpfle
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // -   depends on: krsort
    // -   depends on: ini_set
    // *     example 1: $trans = {'hello' : 'hi', 'hi' : 'hello'};
    // *     example 1: strtr('hi all, I said hello', $trans)
    // *     returns 1: 'hello all, I said hi'
    // *     example 2: strtr('äaabaåccasdeöoo', 'äåö','aao');
    // *     returns 2: 'aaabaaccasdeooo'
    // *     example 3: strtr('ääääääää', 'ä', 'a');
    // *     returns 3: 'aaaaaaaa'
    // *     example 4: strtr('http', 'pthxyz','xyzpth');
    // *     returns 4: 'zyyx'
    // *     example 5: strtr('zyyx', 'pthxyz','xyzpth');
    // *     returns 5: 'http'
    // *     example 6: strtr('aa', {'a':1,'aa':2});
    // *     returns 6: '2'
    var fr = '',
      i = 0,
      j = 0,
      lenStr = 0,
      lenFrom = 0,
      tmpStrictForIn = false,
      fromTypeStr = '',
      toTypeStr = '',
      istr = '';
    var tmpFrom = [];
    var tmpTo = [];
    var ret = '';
    var match = false;
   
    // Received replace_pairs?
    // Convert to normal from->to chars
    if (typeof from === 'object') {
      tmpStrictForIn = this.ini_set('phpjs.strictForIn', false); // Not thread-safe; temporarily set to true
      from = this.krsort(from);
      this.ini_set('phpjs.strictForIn', tmpStrictForIn);
   
      for (fr in from) {
        if (from.hasOwnProperty(fr)) {
          tmpFrom.push(fr);
          tmpTo.push(from[fr]);
        }
      }
   
      from = tmpFrom;
      to = tmpTo;
    }
   
    // Walk through subject and replace chars when needed
    lenStr = str.length;
    lenFrom = from.length;
    fromTypeStr = typeof from === 'string';
    toTypeStr = typeof to === 'string';
   
    for (i = 0; i < lenStr; i++) {
      match = false;
      if (fromTypeStr) {
        istr = str.charAt(i);
        for (j = 0; j < lenFrom; j++) {
          if (istr == from.charAt(j)) {
            match = true;
            break;
          }
        }
      } else {
        for (j = 0; j < lenFrom; j++) {
          if (str.substr(i, from[j].length) == from[j]) {
            match = true;
            // Fast forward
            i = (i + from[j].length) - 1;
            break;
          }
        }
      }
      if (match) {
        ret += toTypeStr ? to.charAt(j) : to[j];
      } else {
        ret += str.charAt(i);
      }
    }
   
    return ret;
  }

 function array_keys (input, searchValue, argStrict) { // eslint-disable-line camelcase
    //  discuss at: https://locutus.io/php/array_keys/
    // original by: Kevin van Zonneveld (https://kvz.io)
    //    input by: Brett Zamir (https://brett-zamir.me)
    //    input by: P
    // bugfixed by: Kevin van Zonneveld (https://kvz.io)
    // bugfixed by: Brett Zamir (https://brett-zamir.me)
    // improved by: jd
    // improved by: Brett Zamir (https://brett-zamir.me)
    //   example 1: array_keys( {firstname: 'Kevin', surname: 'van Zonneveld'} )
    //   returns 1: [ 'firstname', 'surname' ]
  
    var search = typeof searchValue !== 'undefined'
    var tmpArr = []
    var strict = !!argStrict
    var include = true
    var key = ''
  
    for (key in input) {
      if (input.hasOwnProperty(key)) {
        include = true
        if (search) {
          if (strict && input[key] !== searchValue) {
            include = false
          } else if (input[key] !== searchValue) {
            include = false
          }
        }
  
        if (include) {
          tmpArr[tmpArr.length] = key
        }
      }
    }
  
    return tmpArr
}

const strstr = (haystack, needle, bool) => {
    //  discuss at: https://locutus.io/php/strstr/
    // original by: Kevin van Zonneveld (https://kvz.io)
    // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
    // improved by: Kevin van Zonneveld (https://kvz.io)
    //   example 1: strstr('Kevin van Zonneveld', 'van')
    //   returns 1: 'van Zonneveld'
    //   example 2: strstr('Kevin van Zonneveld', 'van', true)
    //   returns 2: 'Kevin '
    //   example 3: strstr('name@example.com', '@')
    //   returns 3: '@example.com'
    //   example 4: strstr('name@example.com', '@', true)
    //   returns 4: 'name'
  
    var pos = 0
  
    haystack += ''
    pos = haystack.indexOf(needle)
    if (pos === -1) {
      return false
    } else {
      if (bool) {
        return haystack.substr(0, pos)
      } else {
        return haystack.slice(pos)
      }
    }
  }

const array_rand = (array, num) =>{ // eslint-disable-line camelcase
    //       discuss at: https://locutus.io/php/array_rand/
    //      original by: Waldo Malqui Silva (https://waldo.malqui.info)
    // reimplemented by: Rafał Kukawski
    //        example 1: array_rand( ['Kevin'], 1 )
    //        returns 1: '0'
  
    // By using Object.keys we support both, arrays and objects
    // which phpjs wants to support
    var keys = Object.keys(array)
  
    if (typeof num === 'undefined' || num === null) {
      num = 1
    } else {
      num = +num
    }
  
    if (isNaN(num) || num < 1 || num > keys.length) {
      return null
    }
  
    // shuffle the array of keys
    for (var i = keys.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)) // 0 ≤ j ≤ i
  
      var tmp = keys[j]
      keys[j] = keys[i]
      keys[i] = tmp
    }
  
    return num === 1 ? keys[0] : keys.slice(0, num)
  }

const ceil = (value) => {
    //  discuss at: https://locutus.io/php/ceil/
    // original by: Onno Marsman (https://twitter.com/onnomarsman)
    //   example 1: ceil(8723321.4)
    //   returns 1: 8723322

    return Math.ceil(value)
}

const max = () => {
    //  discuss at: https://locutus.io/php/max/
    // original by: Onno Marsman (https://twitter.com/onnomarsman)
    //  revised by: Onno Marsman (https://twitter.com/onnomarsman)
    // improved by: Jack
    //      note 1: Long code cause we're aiming for maximum PHP compatibility
    //   example 1: max(1, 3, 5, 6, 7)
    //   returns 1: 7
    //   example 2: max([2, 4, 5])
    //   returns 2: 5
    //   example 3: max(0, 'hello')
    //   returns 3: 0
    //   example 4: max('hello', 0)
    //   returns 4: 'hello'
    //   example 5: max(-1, 'hello')
    //   returns 5: 'hello'
    //   example 6: max([2, 4, 8], [2, 5, 7])
    //   returns 6: [2, 5, 7]
  
    var ar
    var retVal
    var i = 0
    var n = 0
    var argv = arguments
    var argc = argv.length
    var _obj2Array = function (obj) {
      if (Object.prototype.toString.call(obj) === '[object Array]') {
        return obj
      } else {
        var ar = []
        for (var i in obj) {
          if (obj.hasOwnProperty(i)) {
            ar.push(obj[i])
          }
        }
        return ar
      }
    }
    var _compare = function (current, next) {
      var i = 0
      var n = 0
      var tmp = 0
      var nl = 0
      var cl = 0
  
      if (current === next) {
        return 0
      } else if (typeof current === 'object') {
        if (typeof next === 'object') {
          current = _obj2Array(current)
          next = _obj2Array(next)
          cl = current.length
          nl = next.length
          if (nl > cl) {
            return 1
          } else if (nl < cl) {
            return -1
          }
          for (i = 0, n = cl; i < n; ++i) {
            tmp = _compare(current[i], next[i])
            if (tmp === 1) {
              return 1
            } else if (tmp === -1) {
              return -1
            }
          }
          return 0
        }
        return -1
      } else if (typeof next === 'object') {
        return 1
      } else if (isNaN(next) && !isNaN(current)) {
        if (current === 0) {
          return 0
        }
        return (current < 0 ? 1 : -1)
      } else if (isNaN(current) && !isNaN(next)) {
        if (next === 0) {
          return 0
        }
        return (next > 0 ? 1 : -1)
      }
  
      if (next === current) {
        return 0
      }
  
      return (next > current ? 1 : -1)
    }
  
    if (argc === 0) {
      throw new Error('At least one value should be passed to max()')
    } else if (argc === 1) {
      if (typeof argv[0] === 'object') {
        ar = _obj2Array(argv[0])
      } else {
        throw new Error('Wrong parameter count for max()')
      }
      if (ar.length === 0) {
        throw new Error('Array must contain at least one element for max()')
      }
    } else {
      ar = argv
    }
  
    retVal = ar[0]
    for (i = 1, n = ar.length; i < n; ++i) {
      if (_compare(retVal, ar[i]) === 1) {
        retVal = ar[i]
      }
    }
  
    return retVal
}

const str_repeat = (str,nAt)=>{

  return str.repeat(nAt)

}

module.exports = {
    substr_count,
    strtolower,
    strtoupper,
    str_replace,
    strlen,
    is_string,
    isset,
    in_array,
    strpos,
    substr,
    method_exists,
    chr,
    function_exists,
    count,
    ord,
    sprintf,
    is_array,
    gzcompress,
    gzuncompress,
    file,
    rtrim,
    explode,
    hexdec,
    round,
    fopen,
    fclose,
    fread,
    fseek,
    file_get_contents,
    strtr,
    array_keys,
    strstr,
    array_rand,
    ceil,
    max,
    str_repeat
}