1. Установка зависимостей

``` bash
npm install
```
2. запуск локольно
``` bash
docker-compose up -d // запуск БД
npm run build
npm run start
```
3. полный запуск в 5 экземплярах, порты не проброшены так-как нужен NGINX
``` bash
docker-compose -f docker-compose-step2.yaml up
```
