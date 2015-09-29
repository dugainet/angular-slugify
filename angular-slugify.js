/**
 * angular-slugify -- provides slugification for AngularJS
 *
 * Copyright © 2013 Paul Smith <paulsmith@pobox.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the “Software”), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function() {
    "use strict";

    var mod = angular.module("slugifier", []);

    // Unicode (non-control) characters in the Latin-1 Supplement and Latin
    // Extended-A blocks, transliterated into ASCII characters.
    var charmap = {
        // latin
    'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'Å': 'A', 'Æ': 'AE',
    'Ç': 'C', 'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E', 'Ì': 'I', 'Í': 'I',
    'Î': 'I', 'Ï': 'I', 'Ð': 'D', 'Ñ': 'N', 'Ò': 'O', 'Ó': 'O', 'Ô': 'O',
    'Õ': 'O', 'Ö': 'O', 'Ő': 'O', 'Ø': 'O', 'Ù': 'U', 'Ú': 'U', 'Û': 'U',
    'Ü': 'U', 'Ű': 'U', 'Ý': 'Y', 'Þ': 'TH', 'ß': 'ss', 'à':'a', 'á':'a',
    'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a', 'æ': 'ae', 'ç': 'c', 'è': 'e',
    'é': 'e', 'ê': 'e', 'ë': 'e', 'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
    'ð': 'd', 'ñ': 'n', 'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
    'ő': 'o', 'ø': 'o', 'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u', 'ű': 'u',
    'ý': 'y', 'þ': 'th', 'ÿ': 'y', 'ẞ': 'SS',
    // greek
    'α':'a', 'β':'b', 'γ':'g', 'δ':'d', 'ε':'e', 'ζ':'z', 'η':'h', 'θ':'8',
    'ι':'i', 'κ':'k', 'λ':'l', 'μ':'m', 'ν':'n', 'ξ':'3', 'ο':'o', 'π':'p',
    'ρ':'r', 'σ':'s', 'τ':'t', 'υ':'y', 'φ':'f', 'χ':'x', 'ψ':'ps', 'ω':'w',
    'ά':'a', 'έ':'e', 'ί':'i', 'ό':'o', 'ύ':'y', 'ή':'h', 'ώ':'w', 'ς':'s',
    'ϊ':'i', 'ΰ':'y', 'ϋ':'y', 'ΐ':'i',
    'Α':'A', 'Β':'B', 'Γ':'G', 'Δ':'D', 'Ε':'E', 'Ζ':'Z', 'Η':'H', 'Θ':'8',
    'Ι':'I', 'Κ':'K', 'Λ':'L', 'Μ':'M', 'Ν':'N', 'Ξ':'3', 'Ο':'O', 'Π':'P',
    'Ρ':'R', 'Σ':'S', 'Τ':'T', 'Υ':'Y', 'Φ':'F', 'Χ':'X', 'Ψ':'PS', 'Ω':'W',
    'Ά':'A', 'Έ':'E', 'Ί':'I', 'Ό':'O', 'Ύ':'Y', 'Ή':'H', 'Ώ':'W', 'Ϊ':'I',
    'Ϋ':'Y',
    // turkish
    'ş':'s', 'Ş':'S', 'ı':'i', 'İ':'I',
    'ğ':'g', 'Ğ':'G',
    // russian
    'а':'a', 'б':'b', 'в':'v', 'г':'g', 'д':'d', 'е':'e', 'ё':'yo', 'ж':'zh',
    'з':'z', 'и':'i', 'й':'j', 'к':'k', 'л':'l', 'м':'m', 'н':'n', 'о':'o',
    'п':'p', 'р':'r', 'с':'s', 'т':'t', 'у':'u', 'ф':'f', 'х':'h', 'ц':'c',
    'ч':'ch', 'ш':'sh', 'щ':'sh', 'ъ':'u', 'ы':'y', 'ь':'', 'э':'e', 'ю':'yu',
    'я':'ya',
    'А':'A', 'Б':'B', 'В':'V', 'Г':'G', 'Д':'D', 'Е':'E', 'Ё':'Yo', 'Ж':'Zh',
    'З':'Z', 'И':'I', 'Й':'J', 'К':'K', 'Л':'L', 'М':'M', 'Н':'N', 'О':'O',
    'П':'P', 'Р':'R', 'С':'S', 'Т':'T', 'У':'U', 'Ф':'F', 'Х':'H', 'Ц':'C',
    'Ч':'Ch', 'Ш':'Sh', 'Щ':'Sh', 'Ъ':'U', 'Ы':'Y', 'Ь':'', 'Э':'E', 'Ю':'Yu',
    'Я':'Ya',
    // ukranian
    'Є':'Ye', 'І':'I', 'Ї':'Yi', 'Ґ':'G', 'є':'ye', 'і':'i', 'ї':'yi', 'ґ':'g',
    // czech
    'č':'c', 'ď':'d', 'ě':'e', 'ň': 'n', 'ř':'r', 'š':'s', 'ť':'t', 'ů':'u',
    'ž':'z', 'Č':'C', 'Ď':'D', 'Ě':'E', 'Ň': 'N', 'Ř':'R', 'Š':'S', 'Ť':'T',
    'Ů':'U', 'Ž':'Z',
    // polish
    'ą':'a', 'ć':'c', 'ę':'e', 'ł':'l', 'ń':'n', 'ś':'s', 'ź':'z',
    'ż':'z', 'Ą':'A', 'Ć':'C', 'Ę':'E', 'Ł':'L', 'Ń':'N', 'Ś':'S',
    'Ź':'Z', 'Ż':'Z',
    // latvian
    'ā':'a', 'ē':'e', 'ģ':'g', 'ī':'i', 'ķ':'k', 'ļ':'l', 'ņ':'n',
    'ū':'u', 'Ā':'A', 'Ē':'E', 'Ģ':'G', 'Ī':'I',
    'Ķ':'K', 'Ļ':'L', 'Ņ':'N', 'Ū':'U',
    // lithuanian
    'ė':'e', 'į':'i', 'ų':'u', 'Ė': 'E', 'Į': 'I', 'Ų':'U',
    // romanian
    'ț':'t', 'Ț':'T', 'ţ':'t', 'Ţ':'T', 'ș':'s', 'Ș':'S', 'ă':'a', 'Ă':'A',
    // vietnamese
    'Ạ': 'A', 'Ả': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ậ': 'A', 'Ẩ': 'A', 'Ẫ': 'A',
    'Ằ': 'A', 'Ắ': 'A', 'Ặ': 'A', 'Ẳ': 'A', 'Ẵ': 'A', 'Ẹ': 'E', 'Ẻ': 'E',
    'Ẽ': 'E', 'Ề': 'E', 'Ế': 'E', 'Ệ': 'E', 'Ể': 'E', 'Ễ': 'E', 'Ị': 'I',
    'Ỉ': 'I', 'Ĩ': 'I', 'Ọ': 'O', 'Ỏ': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ộ': 'O',
    'Ổ': 'O', 'Ỗ': 'O', 'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ợ': 'O', 'Ở': 'O',
    'Ỡ': 'O', 'Ụ': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U',
    'Ự': 'U', 'Ử': 'U', 'Ữ': 'U', 'Ỳ': 'Y', 'Ỵ': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y',
    'Đ': 'D', 'ạ': 'a', 'ả': 'a', 'ầ': 'a', 'ấ': 'a', 'ậ': 'a', 'ẩ': 'a',
    'ẫ': 'a', 'ằ': 'a', 'ắ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ẹ': 'e',
    'ẻ': 'e', 'ẽ': 'e', 'ề': 'e', 'ế': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',
    'ị': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ọ': 'o', 'ỏ': 'o', 'ồ': 'o', 'ố': 'o',
    'ộ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o',
    'ở': 'o', 'ỡ': 'o', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u', 'ư': 'u', 'ừ': 'u',
    'ứ': 'u', 'ự': 'u', 'ử': 'u', 'ữ': 'u', 'ỳ': 'y', 'ỵ': 'y', 'ỷ': 'y',
    'ỹ': 'y', 'đ': 'd',
    // currency
    '€': 'euro', '₢': 'cruzeiro', '₣': 'french franc', '£': 'pound',
    '₤': 'lira', '₥': 'mill', '₦': 'naira', '₧': 'peseta', '₨': 'rupee',
    '₩': 'won', '₪': 'new shequel', '₫': 'dong', '₭': 'kip', '₮': 'tugrik',
    '₯': 'drachma', '₰': 'penny', '₱': 'peso', '₲': 'guarani', '₳': 'austral',
    '₴': 'hryvnia', '₵': 'cedi', '¢': 'cent', '¥': 'yen', '元': 'yuan',
    '円': 'yen', '﷼': 'rial', '₠': 'ecu', '¤': 'currency', '฿': 'baht',
    "$": 'dollar', '₹': 'indian rupee',
    // symbols
    '©':' ', 'œ': 'oe', 'Œ': 'OE', '∑': 'sum', '®': ' ', '†': '+',
    '“': '"', '”': '"', '‘': "'", '’': "'", '∂': 'd', 'ƒ': 'f', '™': 'tm',
    '℠': 'sm', '…': '...', '˚': 'o', 'º': 'o', 'ª': 'a', '•': '*',
    '∆': 'delta', '∞': 'infinity', '♥': 'love', '&': 'and', '|': 'or',
    '<': 'less', '>': 'greater',
        ' ': "",
        '¡': "!",

        '¦': "|",
        '§': "SS",
        '¨': "\"",

        '«': "<<",
        '¬': "not",
        '­': "-",

        '°': "",
        '±': "",
        '²': "^2",
        '³': "^3",
        '´': "'",
        'µ': "u",
        '¶': "P",
        '·': ".",
        '¸': ",",
        '¹': "",

        '»': ">>",
        '¼': " 1/4 ",
        '½': " 1/2 ",
        '¾': " 3/4 ",
        '¿': ""
    };

    var Downcoder = new Object();
    Downcoder.Initialize = function()
    {
        if (Downcoder.map) // already made
            return ;
        Downcoder.map ={}
        Downcoder.chars = '' ;

        for (var c in charmap)
        {
            Downcoder.map[c] = charmap[c] ;
            Downcoder.chars += c ;
        }

        Downcoder.regex = new RegExp('[' + Downcoder.chars + ']|[^' + Downcoder.chars + ']+','g') ;
    }

    var doCharmap = function( text )
    {
        Downcoder.Initialize() ;
        var downcoded =""
        var pieces = text.match(Downcoder.regex);
        if(pieces)
        {
            for (var i = 0 ; i < pieces.length ; i++)
            {
                if (pieces[i].length == 1)
                {
                    var mapped = Downcoder.map[pieces[i]] ;
                    if (mapped != null)
                    {
                        downcoded+=mapped;
                        continue ;
                    }
                }
                downcoded+=pieces[i];
            }
        }
        else
        {
            downcoded = text;
        }
        return downcoded;
    }


    function _slugify(s) {
        if (!s) return "";


        s = doCharmap(s);

        s = s.replace(/[^-\w\s]/g, ''); // remove unneeded chars
        s = s.replace(/^\s+|\s+$/g, '') // trim leading/trailing spaces
        s = s.replace(/[-\s]+/g, '-')   // convert spaces to hyphens
        s = s.toLowerCase();             // convert to lowercase
    
        return s;
    }

    mod.factory("Slug", function() {
        return {
            slugify: _slugify
        };
    });

    mod.directive("slug", ["Slug", function(Slug) {
        return {
            restrict: "E",
            scope: {
                to: "=",
            },
            transclude: true,
            replace: true,
            template: "<div ng-transclude></div>",
            link: function(scope, elem, attrs) {
                if (!attrs.from) {
                    throw "must set attribute 'from'";
                }
                scope.$parent.$watch(attrs.from, function(val) {
                    scope.to = Slug.slugify(val);
                });
            }
        };
    }]);

    mod.filter("slugify", ["Slug", function(Slug) {
        return function(input) {
            return Slug.slugify(input);
        };
    }]);
})();
