#모노레포 구성완료
```shell
yarn install

#python 설치 필요
#techdocs local 실행을 위한 준비
pip install mkdocs mkdocs-techdocs-core

cd ./storybook && yarn install

yarn dev
```

## software catalog 사용

### 구조

```****
# dev-portal-catalog-template repository
├── react-template
├── springboot-template
    ├── template.yaml # 템플릿 세부 설정
```
현재 템플릿들은 별도의 Repository에서 별도로 관리하고 있으며
[dev-portal-catalog-template](https://github.com/shinhancard/dev-portal-catalog-template
) 에서 확인할 수 있다

```
├── app-config.yaml # catalog url 설정
├── packages
    ├── app > src
        ├── App.tsx # search extension 설정
    ├── backend > src
        ├── providers
            ├── exampleRouter.ts # 예제 backend url 경로
```
템플릿을 추가한 경우에는 app-config.yaml 파일에 경로를 추가해 주어야 한다