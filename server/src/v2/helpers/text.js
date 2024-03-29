/*
    ----- GROUP 43 Header -----
    Component Name: Text
    Description: General text helpers
    Date of Creation: 28/05/2022
    Author(s): Mitchell Sundstrom
*/

export function escape(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")
}

export function stripTrailingSlash(str) {
  if (str.substr(-1) === '/') {
    return str.substr(0, path.length - 1)
  }

  return str
}

export function portrait() {
  var strs = [
    "4qCf4qK74qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qGf4qCb4qK74qO/CuKhhuKgiuKgiOKjv+Kiv+Khn+Kgm+Kiv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjt+KjjuKgiOKguwrio7fio6DioIHiooDioLDioIDio7Dio7/io7/io7/io7/io7/io7/ioJ/ioIvioJvioJvioL/ioL/ior/io7/io7/io7/io6fioIDiornio7/ioZHioJDiorAK4qO/4qO/4qCA4qCB4qCA4qCA4qO/4qO/4qO/4qO/4qCf4qGp4qCQ4qCA4qCA4qCA4qCA4qKQ4qCg4qCI4qCK4qO/4qO/4qO/4qGH4qCY4qCB4qKA4qCG4qKACuKjv+Kjv+KjhuKggOKggOKipOKjv+Kjv+Khv+Kgg+KgiOKggOKjoOKjtuKjv+Kjv+Kjt+KjpuKhgOKggOKggOKgiOKiv+Kjv+Kjh+KhhuKggOKggOKjoOKjvgrio7/io7/io7/io6fio6bio7/io7/io7/ioY/ioIDioIDio7Dio7/io7/io7/io7/io7/io7/io7/ioYbioIDioIDioJDio7/io7/io7fio6bio7fio7/io78K4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qGG4qCA4qKw4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qGE4qCA4qCA4qO/4qO/4qO/4qO/4qO/4qO/4qO/CuKjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+KhhuKggOKjvuKjv+Kjv+Kgi+KggeKggOKgieKgu+Kjv+Kjv+Kjp+KggOKgoOKjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjvwrio7/io7/io7/io7/io7/io7/io7/io7/io7/ioYDio7/iob/ioIHioIDioIDioIDioIDioIDioJjior/io7/ioIDio7rio7/io7/io7/io7/io7/io7/io78K4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qOn4qOg4qOC4qCA4qCA4qCA4qCA4qCA4qCA4qCA4qKA4qOB4qKg4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/CuKjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjt+KjtuKjhOKjpOKjpOKjlOKjtuKjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjvw==",
    "4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qC/4qC/4qC/4qC/4qC/4qC/4qK/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/CuKjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kgn+KjieKhpeKgtuKituKjv+Kjv+Kjv+Kjv+Kjt+KjhuKgieKgm+Kgv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjvwrio7/io7/io7/io7/io7/io7/io7/iob/ioqHioZ7ioIHioIDioIDioKTioIjioL/ioL/ioL/ioL/io7/ioIDiorvio6bioYjioLvio7/io7/io7/io7/io78K4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qGH4qCY4qGB4qCA4qKA4qOA4qOA4qOA4qOI4qOB4qOQ4qGS4qCi4qKk4qGI4qCb4qK/4qGE4qC74qO/4qO/4qO/4qO/CuKjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Khh+KggOKigOKjvOKjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+KjtuKjhOKgieKgkOKghOKhiOKigOKjv+Kjv+Kjv+Kjvwrio7/io7/io7/io7/io7/io7/io7/ioIfioqDio7/io7/io7/io7/iob/ior/io7/io7/io7/ioIHioojio7/ioYTioIDiooDio4DioLjio7/io7/io7/io78K4qO/4qO/4qO/4qO/4qG/4qCf4qOh4qO24qO24qOs4qOt4qOl4qO04qCA4qO+4qO/4qO/4qO/4qO24qO+4qO/4qOn4qCA4qO84qO/4qO34qOM4qG74qK/4qO/CuKjv+Kjv+Kgn+Kji+KjtOKjvuKjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Khh+Kiv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Khv+KiuOKjv+Kjv+Kjv+Kjv+Kjt+KghOKiuwrioY/ioLDior7io7/io7/io7/io7/io7/io7/io7/io7/io7/iob/ioJ/iooLio63io7/io7/io7/io7/io7/ioIfioJjioJvioJvioonio4nio6Dio7Tio74K4qO/4qO34qOm4qOs4qON4qOJ4qOJ4qOb4qOb4qOJ4qCJ4qOk4qO24qO+4qO/4qO/4qO/4qO/4qO/4qO/4qG/4qKw4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/CuKjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjp+KhmOKjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Khh+KjvOKjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjvwrio7/io7/io7/io7/io7/io7/io7/io7/io7/io7/io7/io4fiorjio7/io7/io7/io7/io7/io7/io7/ioIHio7/io7/io7/io7/io7/io7/io7/io7/io78=",
    "4qKA4qOg4qO+4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qCA4qCA4qCA4qCA4qOg4qOk4qO24qO2CuKjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+KggOKggOKggOKisOKjv+Kjv+Kjv+Kjvwrio7/io7/io7/io7/io7/io7/io7/io7/io7/io7/io7/io7/io7/io7/io7/io7/io7/io7/io7/io7/io7/io7/io6fio4Dio4Dio77io7/io7/io7/io78K4qO/4qO/4qO/4qO/4qO/4qGP4qCJ4qCb4qK/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qG/4qO/CuKjv+Kjv+Kjv+Kjv+Kjv+Kjv+KggOKggOKggOKgiOKgm+Kiv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kgv+Kgm+KgieKggeKggOKjvwrio7/io7/io7/io7/io7/io7/io6fioYDioIDioIDioIDioIDioJnioL/ioL/ioL/ioLvioL/ioL/ioJ/ioL/ioJvioInioIDioIDioIDioIDioIDio7jio78K4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO34qOE4qCA4qGA4qCA4qCA4qCA4qCA4qCA4qCA4qCA4qCA4qCA4qCA4qCA4qCA4qCA4qCA4qCA4qKA4qO04qO/4qO/CuKjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kgj+KggOKggOKggOKggOKggOKggOKggOKggOKggOKggOKggOKggOKggOKggOKgoOKjtOKjv+Kjv+Kjv+Kjvwrio7/io7/io7/io7/io7/io7/io7/io7/ioZ/ioIDioIDiorDio7nioYbioIDioIDioIDioIDioIDioIDio63io7fioIDioIDioIDioLjio7/io7/io7/io78K4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qCD4qCA4qCA4qCI4qCJ4qCA4qCA4qCk4qCE4qCA4qCA4qCA4qCJ4qCB4qCA4qCA4qCA4qCA4qK/4qO/4qO/4qO/CuKjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+KivuKjv+Kjt+KggOKggOKggOKggOKhoOKgpOKihOKggOKggOKggOKgoOKjv+Kjv+Kjt+KggOKiuOKjv+Kjv+Kjvwrio7/io7/io7/io7/io7/io7/io7/io7/ioYDioInioIDioIDioIDioIDioIDiooTioIDiooDioIDioIDioIDioIDioInioInioIHioIDioIDio7/io7/io78K4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qO/4qOn4qCA4qCA4qCA4qCA4qCA4qCA4qCA4qCI4qCA4qCA4qCA4qCA4qCA4qCA4qCA4qCA4qCA4qCA4qK54qO/4qO/CuKjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kjv+Kgg+KggOKggOKggOKggOKggOKggOKggOKggOKggOKggOKggOKggOKggOKggOKggOKggOKggOKiuOKjv+Kjvw=="
  ]
  return Buffer.from(strs[Math.floor(Math.random()*strs.length)], 'base64').toString().split("\n")
}
