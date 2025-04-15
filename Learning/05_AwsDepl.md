# AWS Deployments

We will use Amazon Web Services ECR + EKS to setup the pipeline and create a CI/CD using github actions.

Add the following scripts in the github actions

Below is your **converted deployment workflow YAMLs** using:

- `aws-actions/configure-aws-credentials` for IAM auth  
- `aws-actions/amazon-ecr-login` for ECR login  
- ECR push with SHA-tag  
- `kubectl set image` to rollout changes in EKS  

> Make sure you've created corresponding **ECR repositories** for each service (`auth`, `client`, `orders`, `payments`, `tickets`, `expiration`, etc.)

---

## 1. `deploy-auth.yml`

```yaml
name: Deploy Auth

on:
  push:
    branches:
      - main
    paths:
      - 'auth/**'

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}

      - name: Login to Amazon ECR
        uses: aws-actions/amazon-ecr-login@v1

      - name: Build and push Docker image
        env:
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t ${{ secrets.ECR_REPO }}/auth:$IMAGE_TAG ./auth
          docker push ${{ secrets.ECR_REPO }}/auth:$IMAGE_TAG

      - name: Update K8s deployment
        run: |
          aws eks update-kubeconfig --name ticketing-cluster --region ${{ secrets.AWS_REGION }}
          kubectl set image deployment/auth-depl auth=${{ secrets.ECR_REPO }}/auth:${{ github.sha }}
```

---

## 2. `deploy-client.yml`

```yaml
name: Deploy Client

on:
  push:
    branches:
      - main
    paths:
      - 'client/**'

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}

      - name: Login to Amazon ECR
        uses: aws-actions/amazon-ecr-login@v1

      - name: Build and push Docker image
        env:
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t ${{ secrets.ECR_REPO }}/client:$IMAGE_TAG ./client
          docker push ${{ secrets.ECR_REPO }}/client:$IMAGE_TAG

      - name: Update K8s deployment
        run: |
          aws eks update-kubeconfig --name ticketing-cluster --region ${{ secrets.AWS_REGION }}
          kubectl set image deployment/client-depl client=${{ secrets.ECR_REPO }}/client:${{ github.sha }}
```

---

## 3. `deploy-orders.yml`

```yaml
name: Deploy Orders

on:
  push:
    branches:
      - main
    paths:
      - 'orders/**'

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}
      - uses: aws-actions/amazon-ecr-login@v1
      - run: |
          docker build -t ${{ secrets.ECR_REPO }}/orders:${{ github.sha }} ./orders
          docker push ${{ secrets.ECR_REPO }}/orders:${{ github.sha }}
          aws eks update-kubeconfig --name ticketing-cluster --region ${{ secrets.AWS_REGION }}
          kubectl set image deployment/orders-depl orders=${{ secrets.ECR_REPO }}/orders:${{ github.sha }}
```

---

## 4. `deploy-payments.yml`

```yaml
name: Deploy Payments

on:
  push:
    branches:
      - main
    paths:
      - 'payments/**'

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}
      - uses: aws-actions/amazon-ecr-login@v1
      - run: |
          docker build -t ${{ secrets.ECR_REPO }}/payments:${{ github.sha }} ./payments
          docker push ${{ secrets.ECR_REPO }}/payments:${{ github.sha }}
          aws eks update-kubeconfig --name ticketing-cluster --region ${{ secrets.AWS_REGION }}
          kubectl set image deployment/payments-depl payments=${{ secrets.ECR_REPO }}/payments:${{ github.sha }}
```

---

## 5. `deploy-tickets.yml`

```yaml
name: Deploy Tickets

on:
  push:
    branches:
      - main
    paths:
      - 'tickets/**'

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}
      - uses: aws-actions/amazon-ecr-login@v1
      - run: |
          docker build -t ${{ secrets.ECR_REPO }}/tickets:${{ github.sha }} ./tickets
          docker push ${{ secrets.ECR_REPO }}/tickets:${{ github.sha }}
          aws eks update-kubeconfig --name ticketing-cluster --region ${{ secrets.AWS_REGION }}
          kubectl set image deployment/tickets-depl tickets=${{ secrets.ECR_REPO }}/tickets:${{ github.sha }}
```

---

## 6. `deploy-manifests.yml` (Infra)

```yaml
name: Deploy Infra Manifests

on:
  push:
    branches:
      - main
    paths:
      - 'infra/**'

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}
      - run: |
          aws eks update-kubeconfig --name ticketing-cluster --region ${{ secrets.AWS_REGION }}
          kubectl apply -f infra/k8s
          kubectl apply -f infra/k8s-prod
```

---

## 7. `deploy-expiration.yml`

```yaml
name: deploy-expiration

on:
  push:
    branches:
      - main
    paths:
      - 'expiration/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}

      - uses: aws-actions/amazon-ecr-login@v1

      - run: |
          docker build -t ${{ secrets.ECR_REPO }}/expiration:${{ github.sha }} ./expiration
          docker push ${{ secrets.ECR_REPO }}/expiration:${{ github.sha }}

      - run: |
          aws eks update-kubeconfig --name ticketing-cluster --region ${{ secrets.AWS_REGION }}
          kubectl set image deployment/expiration-depl expiration=${{ secrets.ECR_REPO }}/expiration:${{ github.sha }}
```

---

```sh
brew install awscli
aws --version

```

To log in to your AWS account from the terminal on your Mac using the IAM user you created, follow these steps:

### Step 1: Configure the AWS CLI with your IAM user's credentials

Run the following command to configure the AWS CLI with the credentials of your IAM user:

```bash
aws configure
```

You will be prompted to enter the following information:

- **AWS Access Key ID**: This is the access key for your IAM user. You can find it in the IAM user console. It will look something like this: `AKIAIOSFODNN7EXAMPLE`.
- **AWS Secret Access Key**: This is the secret key for your IAM user. You will also get this when you create the IAM user. It will look something like this: `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`.
- **Default region name**: Enter the AWS region where you want to work (e.g., `us-east-1`).
- **Default output format**: You can choose a default format such as `json`.

### Step 2: Test the setup

To verify that the AWS CLI is correctly configured, you can run a test command like this:

```bash
aws sts get-caller-identity
```

This will return information about the IAM user you're logged in as, such as the `UserId`, `Account`, and `Arn`. It will help you confirm that you're using the correct credentials.

### Step 3: Access AWS services using the terminal

Now that your AWS CLI is configured, you can start using AWS services via the terminal. For example, to list all your ECR repositories:

```bash
aws ecr describe-repositories --query "repositories[*].repositoryName" --output table
```

### Step 4: Using `kubectl` with EKS

After you've configured the AWS CLI, you can also interact with your EKS cluster. To do that, you need to configure `kubectl` to use your EKS cluster. Use the following command:

```bash
aws eks --region <your-region> update-kubeconfig --name <your-cluster-name>
```

Replace `<your-region>` with the region your EKS cluster is located in, and `<your-cluster-name>` with the name of your EKS cluster.

This will update your kubeconfig file, and you'll be able to interact with your EKS cluster using `kubectl` commands.

Great! Now that you have access to your AWS account and are able to interact with AWS via the CLI, let's move forward with setting up the pipeline. As you mentioned, the next step is to **create the EKS (Elastic Kubernetes Service) cluster**. 

Here's a step-by-step guide to creating the EKS cluster:

### Step 1: Create an EKS Cluster

1. **Install eksctl** (if not already installed):

   `eksctl` is the easiest way to create EKS clusters. You can install it via Homebrew on macOS if you haven't already:

   ```bash
   brew install eksctl
   ```

2. **Create EKS Cluster with eksctl**:

   You can now create an EKS cluster using the following `eksctl` command. Replace `<your-cluster-name>` with the desired name for your cluster, and `<region>` with the region where you'd like to create the cluster (e.g., `us-east-1`).

   ```bash
   eksctl create cluster \
     --name <your-cluster-name> \
     --version 1.21 \
     --region <region> \
     --nodegroup-name <your-nodegroup-name> \
     --node-type t3.medium \
     --nodes 2 \
     --nodes-min 1 \
     --nodes-max 3 \
     --managed
   ```

   **Explanation of the options:**
   - `--name <your-cluster-name>`: The name of your cluster.
   - `--version 1.21`: The Kubernetes version for your cluster.
   - `--region <region>`: The AWS region where you want to create the cluster (e.g., `us-east-1`).
   - `--nodegroup-name <your-nodegroup-name>`: Name of the node group in your cluster.
   - `--node-type t3.medium`: Type of EC2 instances to use for the worker nodes.
   - `--nodes 2`: Number of nodes to create in the node group initially.
   - `--nodes-min 1`: Minimum number of nodes in the node group.
   - `--nodes-max 3`: Maximum number of nodes in the node group.
   - `--managed`: Creates a managed node group with the EKS cluster.

   This will create your EKS cluster and the necessary node group. It may take some time (around 15-20 minutes).

3. **Verify Cluster Creation**:

   After the cluster is created, verify the status by running:

   ```bash
   eksctl get cluster --region <region>
   ```

   This will show the list of clusters in the specified region.

4. **Update kubeconfig**:

   Once your cluster is created, you need to update the `kubectl` configuration to point to your new EKS cluster:

   ```bash
   aws eks --region <region> update-kubeconfig --name <your-cluster-name>
   ```

   This will set up the `kubectl` configuration to interact with your new EKS cluster.

5. **Verify Kubernetes Connection**:

   After updating the kubeconfig, verify your connection to the cluster:

   ```bash
   kubectl get nodes
   ```

   This should show the nodes in your cluster. If everything is working, you'll see a list of nodes.

### Step 2: Create the Deployment and Service Manifests

Since you have a `infra` directory in your repo, this step involves applying the Kubernetes deployment and service manifests to your EKS cluster.

In your `infra/k8s` and `infra/k8s-prod` directories, you should have the Kubernetes YAML files for each service (e.g., auth, client, tickets, etc.).

1. **Apply Kubernetes Manifests**:

   Run the following command to apply your Kubernetes manifests to the cluster:

   ```bash
   kubectl apply -f infra/k8s
   kubectl apply -f infra/k8s-prod
   ```

   These commands will deploy your services to the EKS cluster.

---

At this point, the EKS cluster should be ready, and your Kubernetes workloads should be deployed using the manifests. The next step will involve setting up your CI/CD pipeline with GitHub Actions, which will automatically update the services deployed in your EKS cluster whenever you push changes to the repository.


Perfect — you're almost there! Since you already have deployment configs and each service structured as a directory, here's a clean and efficient plan to:

1. **Build Docker images for each service**
2. **Tag them for ECR**
3. **Push them to ECR**
4. **Update the `image:` field in your existing deployment YAMLs**

---

## ✅ Step-by-Step Commands

Let’s say your 6 services are:

- `auth`
- `client`
- `expiration`
- `nats-test`
- `orders`
- `payments`
- `tickets`

Assume your AWS account ID is `600790316142`, and region is `us-east-1`.

---

### 🔐 Step 1: Authenticate Docker to ECR

```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 600790316142.dkr.ecr.us-east-1.amazonaws.com
```

---

### 🛠 Step 2: Build, Tag, and Push Images for Each Service

Replace `<service>` with each service name one by one. You can also script this if you'd like (I'll give you a script below too).

### 🔁 Manual Commands (for 1 service)

```bash
# 1. Go into service folder
cd auth

# 2. Build the Docker image
docker build -t auth .

# 3. Tag the image for ECR
docker tag auth:latest 600790316142.dkr.ecr.us-east-1.amazonaws.com/auth:latest

# 4. Push the image to ECR
docker push 600790316142.dkr.ecr.us-east-1.amazonaws.com/auth:latest

# Go back
cd ..
```

Repeat for `client`, `orders`, etc.

---

### ⚡️ Optional: One-Liner Script for All Services

Save this and run in your project root:

```bash
#!/bin/bash

AWS_ACCOUNT_ID=600790316142
REGION=us-east-1
SERVICES=(auth client expiration nats-test payments tickets orders)

for SERVICE in "${SERVICES[@]}"; do
  echo "Processing $SERVICE..."
  docker build -t $SERVICE ./$SERVICE
  docker tag $SERVICE:latest $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$SERVICE:latest
  docker push $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$SERVICE:latest
done
```

> Save this as `build-and-push.sh`, then:
```bash
chmod +x build-and-push.sh
./build-and-push.sh
```

---

### 📝 Step 3: Update Deployment YAMLs

Update each service's `deployment.yaml` file with the **ECR image** like so:

```yaml
containers:
  - name: auth
    image: 600790316142.dkr.ecr.us-east-1.amazonaws.com/auth:latest
```

Do this for each service (`auth`, `orders`, etc.).

---

### 🚀 Step 4: Apply the Deployments to EKS

After updating the images, apply all your YAML files:

```bash
kubectl apply -f infra/k8s/auth-deployment.yaml
kubectl apply -f infra/k8s/orders-deployment.yaml
kubectl apply -f infra/k8s/...
```

You can also apply a whole folder if structured well:

```bash
kubectl apply -f infra/k8s/
```

---

### ✅ Step 5: Verify Everything is Running

```bash
kubectl get pods
kubectl get services
```

If needed:

```bash
kubectl logs <pod-name>
```

---

Want me to check/update one deployment YAML for ECR image usage or help with the script logic?