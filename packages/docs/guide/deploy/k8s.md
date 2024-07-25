# 在k8s中安装
```yaml
kind: Deployment
apiVersion: apps/v1
metadata:
  name: myprint
  namespace: myprint
  labels:
    monit: actived
    tier: myprint
spec:
  replicas: 1
  selector:
    matchLabels:
      monit: actived
      tier: myprint
  template:
    metadata:
      labels:
        monit: actived
        tier: myprint
    spec:
      volumes:
        - name: log-storage
          hostPath:
            path: /data/logs/tmp/myprint
            type: ''
      containers:
        - name: myprint
          image: centos:latest
          command: ["/bin/bash", "-c", "--"]
          args: ["while true; do sleep 30; done;"]
          ports:
            - name: http
              containerPort: 19898
              protocol: TCP
          env:
            - name: TZ
              value: Asia/Shanghai
            - name: USE_NOHUP
              value: 'true'
          resources: {}
          volumeMounts:
            - name: log-storage
              mountPath: /usr/local/tomcat/logs
          terminationMessagePath: /dev/termination-log
          terminationMessagePolicy: File
          imagePullPolicy: Always
      restartPolicy: Always
      terminationGracePeriodSeconds: 30
      dnsPolicy: ClusterFirst
      nodeSelector:
        kubernetes.io/arch: amd64
        k3s.io/hostname: 'worker-01'
      schedulerName: default-scheduler
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 100%
      maxSurge: 25%
  revisionHistoryLimit: 10
  progressDeadlineSeconds: 600

---
kind: Service
apiVersion: v1
metadata:
  name: myprint-svc
  namespace: myprint
  labels:
    monit: actived
    svc: myprint-svc
spec:
  ports:
    - name: http
      protocol: TCP
      port: 19898
      targetPort: 19898
  selector:
    monit: actived
    tier: myprint

---
kind: Ingress
apiVersion: networking.k8s.io/v1beta1
metadata:
  name: myprint
  namespace: myprint
spec:
  rules:
    - host: service.myprint.com
      http:
        paths:
          - pathType: ImplementationSpecific
            backend:
              serviceName: myprint-svc
              servicePort: http

```

上面只是启动一个centos服务
```shell
容器启动后，进入pod内部

需要把对应的文件复制进去执行，后面会考虑做成镜像

1、进入容器内部
cd /etc/yum.repos.d/
mkdir bk/
mv * bk/

2、设置yum仓库
curl -o /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-8.repo

yum clean all
yum makecache

yum install -y zip

cd /opt
3、下载文件
curl -Lo "myprint.zip" https://tmp-hd101.vx-cdn.com/file-6698781306910-66987971618ed/myprint.zip
unzip myprint.zip
rm -rf __MACOSX/
rm -rf myprint.zip
cd myprint

4、安装字体文件
cp fonts/* /usr/share/fonts/
fc-cache -fv
fc-list


5、启动服务
./myprint-node-server start &
6、停止服务
./myprint-node-server stop
7、修复chrome报错
yum install -y nss libdrm mesa-libgbm libXcomposite libXcursor libXdamage libXext libXi libXtst cups-libs libXScrnSaver libXrandr alsa-lib atk at-spi2-atk gtk3 libdrm-devel

8、再次启动服务
./myprint-node-server start &

9、测试服务
curl --request POST \
--output out.pdf \
  --url http://127.0.0.1:19898/print/generatePdf \
  --header 'Accept: */*' \
  --header 'Accept-Encoding: gzip, deflate, br' \
  --header 'Connection: keep-alive' \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: PostmanRuntime-ApipostRuntime/1.1.0' \
  --data '{
    "cmd": "print",
    "content": "<div style=\"  --tcolor: black;\"><div>中文sdf123 - myprint</div></div>",
    "height": 297,
    "width": 210
}'
```
