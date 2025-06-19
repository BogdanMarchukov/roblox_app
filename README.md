1. Установка зависимостей

``` bash
npm install
```
2. запуск локольно
``` bash
docker-compose up -d // запуск БД
npm run build
npm run start
npm run test // нагрузочное тестирование, требует локальной установке https://github.com/grafana/k6
```
3. полный запуск в 5 экземплярах, порты не проброшены так-как нужен NGINX
``` bash
docker-compose -f docker-compose-step2.yaml up
```
