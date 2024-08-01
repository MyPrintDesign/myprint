# 在k8s中部署

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
      containers:
        - name: myprint
          image: registry.cn-hangzhou.aliyuncs.com/css_public/myprint:1.0.2
          ports:
            - name: http
              containerPort: 19898
              protocol: TCP
          env:
            - name: TZ
              value: Asia/Shanghai
            - name: USE_NOHUP
              value: 'true'
          terminationMessagePath: /dev/termination-log
          terminationMessagePolicy: File
          imagePullPolicy: Always
      restartPolicy: Always
      terminationGracePeriodSeconds: 30
      dnsPolicy: ClusterFirst
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

```shell
容器启动后，进入pod内部

测试服务

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

## 自定义镜像请参考

[`docker`](./docker#build-at-docker)
