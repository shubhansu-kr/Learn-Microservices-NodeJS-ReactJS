# Kubernetes

kubectl version

Kubernetes Cluster : A collection of nodes plus a master to manage them
Node : A virtual machine that will run our containers
Pod : More or less a running container. However a pod can run multiple containers.
Deployment : Monitor a set of pods and make sure they are running and restart them when they crash.
Service : Provides an easy to access url to access a running container

## Config File to create a pod

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: posts
spec:
  containers:
    - name: posts
      image: shubhansukr/posts:0.0.1
```

kubectl apply -f posts.yaml
kubectl get pods

Common kubernetes commands

docker ps -> kubectl get pods
docker exec -it container_id cmd -> kubectl exec -it pod_name cmd
docker log container_id -> kubectl logs pod_name

kubectl delete pod pod_name
kubectl apply -f configFile
kubectl describe pod pod_name

## Deployments

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: posts-depl
spec:
  replicas: 1
  selector:
    matchLabels:
      app: posts
  template:
    metadata:
      labels:
        app: posts
    spec:
      containers:
        - name: posts
          image: shubhansukr/posts:0.0.1
```

Common commands around deployments

kubectl get deployments
kubectl describe deployements depl_name
kubectl apply -f config_file_name
kubectl delete deployment depl_name

Updating a deployment:

Method 1:

1. Make a change to your code project
2. Rebuild the image, specify a new image version
3. In the deployment config file, update the version of the image
4. run - `kubectl apply -f configFileName`

Method 2:

1. The deployment must be using the latest tag in the pod spec section of config file.
2. Make an update to the code
3. Build the image
4. Push the image to docker hub
5. Run the command `kubectl rollout restart deployment depl_name`

## Networks in Kubernetes

Services provide networking between pods. There are 4 types of services in kubernetes:

1. ClusterIP : Exposes pods within the cluster
2. NodePort : Exposes pods to outside cluster -> Used for dev
3. Load Balancer : Exposes pods to outside cluster -> Used for prod
4. External Name :

Just like depl and pods, services are also an object in kubernetes which can be created using a config file.

Create a nodeport service:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: posts-srv
spec:
  type: NodePort
  selector:
    app: posts
  ports:
    - name: posts
      protocol: TCP
      port: 4000
      targetPort: 400
```

This nodeport service exposes the posts service to the external cluster or service trying to access the pods. The external request channels through nodeport service to the port of service which redirects to the target port of the pod.

## Deployment for event-bus service

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: event-bus-depl
spec:
  replicas: 1
  selector:
    matchLabels:
      app: event-bus
  template:
    metadata:
      labels:
        app: event-bus
    spec:
      containers:
        - name: event-bus
          image: shubhansukr/event-bus:latest
```

Event bus communicates with the other services but as of now we dont have any service to connect all the pods. This is where cluster ip services comes into play. It creates a network of all the pods.

Its simple to add this cluster ip into the deployment config.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: event-bus-depl
spec:
  replicas: 1
  selector:
    matchLabels:
      app: event-bus
  template:
    metadata:
      labels:
        app: event-bus
    spec:
      containers:
        - name: event-bus
          image: shubhansukr/event-bus:latest
---
apiVersion: v1
kind: Service
metadata:
  name: event-bus-srv
spec:
  type: ClusterIP # if we dont give type, it will be auto assigned to clusterIP
  selector:
    app: event-bus
  ports:
    - name: event-bus
      protocol: TCP
      port: 4005
      targetPort: 4005
```

Update the posts-depl.yaml to create a cluster ip service

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: posts-depl
spec:
  replicas: 1
  selector:
    matchLabels:
      app: posts
  template:
    metadata:
      labels:
        app: posts
    spec:
      containers:
        - name: posts
          image: shubhansukr/posts:latest
---
apiVersion: v1
kind: Service
metadata:
  name: posts-clusterip-srv
spec:
  selector:
    app: posts
  ports:
    - name: posts
      protocol: TCP
      port: 4000
      targetPort: 4000
```

Now we need to update the code for our services to reach out to k8s url instead of local host service.

Replace localhost with Cluster Ip sercive name.

### Create cluster ip service for each service

We need to create clusterip service and a deployment for each service so that they can communicate over the event bus.
