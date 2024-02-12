const zlib = require('zlib');
const fs = require('fs')

const sprintf = require('sprintf-js').sprintf

const substr_count = (str, search) => { return `${str}`.split(search).length - 1 }

const strtolower = (str) => { return `${str}`.toLowerCase() }

const strtoupper = (str) => { return `${str}`.toUpperCase() }

const str_replace = (searchvalue, newvalue, from) => { return `${from}`.replace(searchvalue, newvalue) }

const str_contains = (str, contains) => { return `${str}`.includes(contains) }

const strlen = (str) => { return `${str}`.length }

const is_string = (xValue) => { return (typeof xValue === 'string') }

const isset = (xValue) => { return (typeof xValue !== 'undefined') }

const strpos = (str, searchvalue) => { return `${str}`.indexOf(searchvalue) }

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
        //const test = require(cModule)
        require.resolve(cModule);
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

    let str = string + ''
    let code = str.charCodeAt(0)

    if (code >= 0xD800 && code <= 0xDBFF) {
        // High surrogate (could change last hex to 0xDB7F to treat
        // high private surrogates as single characters)
        let hi = code
        if (str.length === 1) {
            // This is just a high surrogate with no following low surrogate,
            // so we return its value;
            return code
            // we could also throw an error as it is not a complete character,
            // but someone may want to know
        }
        let low = str.charCodeAt(1)
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
    let letters = str.split(''),
        i = letters.length - 1;

    // Loop letters
    for (i; i >= 0; i--) {
        if (chars.indexOf(letters[i]) === -1) {
            return str.substring(0, i + 1);
        }
    }

    return str;

};

const explode = (search, from) => { return `${from}`.split(`${search}`) }

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

const number_format = (num, decimals = 0, decimal_separator = '.') => {
  let segments = `${num}`.split('.')
  num = !segments[1] ? segments[0] : segments.join('.') + '0'.repeat(decimals) + '1'

  return Number.prototype.toFixed.call(+num, decimals).replace('.', decimal_separator) 
}

const round = (num, decimals = 0) => { return +number_format(num, decimals) }

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

const file_exists = (filename)=>{ return fs.existsSync(filename) }

const file_get_contents = (filename)=>{
    // discuss at: https://locutus.io/php/file_get_contents/
    return fs.readFileSync(filename, 'utf-8')
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
    let fr = '',
      i = 0,
      j = 0,
      lenStr = 0,
      lenFrom = 0,
      tmpStrictForIn = false,
      fromTypeStr = '',
      toTypeStr = '',
      istr = '';
    let tmpFrom = [];
    let tmpTo = [];
    let ret = '';
    let match = false;
   
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
  
    let search = typeof searchValue !== 'undefined'
    let tmpArr = []
    let strict = !!argStrict
    let include = true
    let key = ''
  
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
  
    let pos = 0
  
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
    let keys = Object.keys(array)
  
    if (typeof num === 'undefined' || num === null) {
      num = 1
    } else {
      num = +num
    }
  
    if (isNaN(num) || num < 1 || num > keys.length) {
      return null
    }
  
    // shuffle the array of keys
    for (let i = keys.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)) // 0 ≤ j ≤ i
  
      let tmp = keys[j]
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

const max = (...argv) => {
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
  
    let ar
    let retVal
    let i = 0
    let n = 0
    let argc = argv.length
    let _obj2Array = function (obj) {
      if (Object.prototype.toString.call(obj) === '[object Array]') {
        return obj
      } else {
        let ar = []
        for (let i in obj) {
          if (obj.hasOwnProperty(i)) {
            ar.push(obj[i])
          }
        }
        return ar
      }
    }
    let _compare = function (current, next) {
      let i = 0
      let n = 0
      let tmp = 0
      let nl = 0
      let cl = 0
  
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

const trim = (str,charlist)=>{
  //  discuss at: https://locutus.io/php/trim/
  // original by: Kevin van Zonneveld (https://kvz.io)
  // improved by: mdsjack (https://www.mdsjack.bo.it)
  // improved by: Alexander Ermolaev (https://snippets.dzone.com/user/AlexanderErmolaev)
  // improved by: Kevin van Zonneveld (https://kvz.io)
  // improved by: Steven Levithan (https://blog.stevenlevithan.com)
  // improved by: Jack
  //    input by: Erkekjetter
  //    input by: DxGx
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  //   example 1: trim('    Kevin van Zonneveld    ')
  //   returns 1: 'Kevin van Zonneveld'
  //   example 2: trim('Hello World', 'Hdle')
  //   returns 2: 'o Wor'
  //   example 3: trim(16, 1)
  //   returns 3: '6'
  let whitespace = [
    ' ',
    '\n',
    '\r',
    '\t',
    '\f',
    '\x0b',
    '\xa0',
    '\u2000',
    '\u2001',
    '\u2002',
    '\u2003',
    '\u2004',
    '\u2005',
    '\u2006',
    '\u2007',
    '\u2008',
    '\u2009',
    '\u200a',
    '\u200b',
    '\u2028',
    '\u2029',
    '\u3000'
  ].join('')
  let l = 0
  let i = 0
  str += ''
  if (charlist) {
    whitespace = (charlist + '').replace(/([[\]().?/*{}+$^:])/g, '$1')
  }
  l = str.length
  for (i = 0; i < l; i++) {
    if (whitespace.indexOf(str.charAt(i)) === -1) {
      str = str.substring(i)
      break
    }
  }
  l = str.length
  for (i = l - 1; i >= 0; i--) {
    if (whitespace.indexOf(str.charAt(i)) === -1) {
      str = str.substring(0, i + 1)
      break
    }
  }
  return whitespace.indexOf(str.charAt(0)) === -1 ? str : ''
}

const strrpos = (haystack,needle,offset)=>{
  //  discuss at: https://locutus.io/php/strrpos/
  // original by: Kevin van Zonneveld (https://kvz.io)
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  // bugfixed by: Brett Zamir (https://brett-zamir.me)
  //    input by: saulius
  //   example 1: strrpos('Kevin van Zonneveld', 'e')
  //   returns 1: 16
  //   example 2: strrpos('somepage.com', '.', false)
  //   returns 2: 8
  //   example 3: strrpos('baa', 'a', 3)
  //   returns 3: false
  //   example 4: strrpos('baa', 'a', 2)
  //   returns 4: 2
  let i = -1
  if (offset) {
    i = (haystack + '')
      .slice(offset)
      .lastIndexOf(needle) // strrpos' offset indicates starting point of range till end,
    // while lastIndexOf's optional 2nd argument indicates ending point of range from the beginning
    if (i !== -1) {
      i += offset
    }
  } else {
    i = (haystack + '')
      .lastIndexOf(needle)
  }
  return i >= 0 ? i : false
}

const empty = (mixedVar)=>{
  //  discuss at: https://locutus.io/php/empty/
  // original by: Philippe Baumann
  //    input by: Onno Marsman (https://twitter.com/onnomarsman)
  //    input by: LH
  //    input by: Stoyan Kyosev (https://www.svest.org/)
  // bugfixed by: Kevin van Zonneveld (https://kvz.io)
  // improved by: Onno Marsman (https://twitter.com/onnomarsman)
  // improved by: Francesco
  // improved by: Marc Jansen
  // improved by: Rafał Kukawski (https://blog.kukawski.pl)
  //   example 1: empty(null)
  //   returns 1: true
  //   example 2: empty(undefined)
  //   returns 2: true
  //   example 3: empty([])
  //   returns 3: true
  //   example 4: empty({})
  //   returns 4: true
  //   example 5: empty({'aFunc' : function () { alert('humpty'); } })
  //   returns 5: false
  let undef
  let key
  let i
  let len
  const emptyValues = [undef, null, false, 0, '', '0']
  for (i = 0, len = emptyValues.length; i < len; i++) {
    if (mixedVar === emptyValues[i]) {
      return true
    }
  }
  if (typeof mixedVar === 'object') {
    for (key in mixedVar) {
      if (mixedVar.hasOwnProperty(key)) {
        return false
      }
    }
    return true
  }
  return false
}

module.exports = {
    substr_count,
    strtolower,
    strtoupper,
    str_replace,
    str_contains,
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
    number_format,
    round,
    fopen,
    fclose,
    fread,
    fseek,
    file_exists,
    file_get_contents,
    strtr,
    array_keys,
    strstr,
    array_rand,
    ceil,
    max,
    str_repeat,
    trim,
    strrpos,
    empty
}
