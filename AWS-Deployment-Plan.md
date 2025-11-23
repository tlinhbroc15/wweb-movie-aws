# KẾ HOẠCH TRIỂN KHAI ỨNG DỤNG MOVIE WEBSITE LÊN AWS

## Mục lục

1. [Tổng quan](#tổng-quan)
2. [Kiến trúc hệ thống trên AWS](#kiến-trúc-hệ-thống-trên-aws)
3. [Phân công nhiệm vụ](#phân-công-nhiệm-vụ)
4. [Chi tiết triển khai](#chi-tiết-triển-khai)
5. [Chiến lược giám sát và vận hành](#chiến-lược-giám-sát-và-vận-hành)
6. [Đảm bảo đáp ứng Rubric](#đảm-bảo-đáp-ứng-rubric)
7. [Các nâng cấp và tối ưu hóa](#các-nâng-cấp-và-tối-ưu-hóa)

## Tổng quan

### Mô tả dự án

Movie Website là ứng dụng phim trực tuyến, bao gồm 3 thành phần chính:

- **Frontend**: Next.js (TypeScript) - Giao diện người dùng chính
- **Admin Frontend**: Next.js - Giao diện quản trị
- **Backend**: Node.js (TypeScript) + Docker - API và xử lý nghiệp vụ

### Mục tiêu triển khai

- Xây dựng hệ thống có tính sẵn sàng cao (High Availability)
- Tự động mở rộng theo nhu cầu (Auto Scaling)
- Bảo mật theo tiêu chuẩn ngành
- Tối ưu chi phí vận hành
- CI/CD tự động hóa quy trình phát triển

## Kiến trúc hệ thống trên AWS

```
                                  ┌───────────────┐
                                  │  CloudFront   │
                                  │  CDN & SSL    │
                                  └───────┬───────┘
                                          │
                                          ▼
┌─────────────────────────────────┐     ┌───────────────┐     ┌─────────────────────────────┐
│             S3                  │     │     WAF       │     │         AWS Shield          │
│    Static Assets & Media        │◄────┤  Web Security │     │      DDoS Protection        │
└─────────────────┬───────────────┘     └───────────────┘     └─────────────┬───────────────┘
                  │                                                         │
         ┌────────┴──────────┐                                              │
         │                   │                                              │
         ▼                   ▼                                              │
┌─────────────────┐  ┌───────────────┐                                      │
│   S3 Bucket     │  │ Application   │◄─────────────────────────────────────┘
│ (Static Assets) │  │ Load Balancer │
└─────────────────┘  └───────┬───────┘
                             │
                             ▼
                    ┌───────────────────┐
                    │    ECS Fargate    │
                    │  (Containers)     │
                    └─────────┬─────────┘
                              │
                    ┌─────────┴────────┐
                    │                  │
                    ▼                  ▼
           ┌────────────────┐  ┌──────────────────┐
           │  ElastiCache   │  │    ECR          │
           │  (Redis)       │  │  Docker Images  │
           └───────┬────────┘  └────────┬─────────┘
                   │                    │
                   │                    │
                   ▼                    ▼
          ┌────────────────────────────────────┐
          │          Amazon RDS                │
          │(Multi-AZ PostgreSQL/MySQL)         │
          └───────────────┬────────────────────┘
                          │
                          ▼
          ┌────────────────────────────────────┐
          │         Amazon S3                  │
          │ (Media Storage - Videos/Images)    │
          └────────────────────────────────────┘
                          │
                          ▼
          ┌────────────────────────────────────┐
          │         AWS Backup                 │
          │(Disaster Recovery & Backup)        │
          └────────────────────────────────────┘
```

### Dịch vụ AWS sử dụng

| Dịch vụ                       | Mục đích                               | Phân Công    | Độ phức tạp | Độ quan trọng | Trạng thái |
| ----------------------------- | -------------------------------------- | ----------   | ----------- | ------------- | ---------- |
| **CloudFront**                | CDN, caching tài nguyên tĩnh và APIs   | Đinh Tú      | Trung bình  | Cao           | Done       |
| **S3**                        | Lưu trữ tài nguyên tĩnh và media       | Đinh Tú      | Thấp        | Cao           | Done       |
| **Application Load Balancer** | Cân bằng tải và định tuyến cho backend | Hoàng Hưng   | Trung bình  | Cao           | Bắt buộc   |
| **ECS Fargate**               | Điều phối container cho backend        | Tao          | Cao         | Cao           | Bắt buộc   |
| **ECR**                       | Lưu trữ Docker images                  | Tao          | Thấp        | Trung bình    | Bắt buộc   |
| **RDS (Multi-AZ)**            | Cơ sở dữ liệu quan hệ có HA            | Luân, Khánh  | Cao         | Rất cao       | Bắt buộc   |
| **IAM**                       | Quản lý quyền truy cập                 | Huy Tú       | Cao         | Rất cao       | Bắt buộc   |
| **CloudWatch**                | Giám sát và cảnh báo                   | Đạt          | Trung bình  | Cao           | Bắt buộc   |
| **CodePipeline**              | CI/CD pipeline                         | Luân, PHưng  | Cao         | Cao           | Bắt buộc   |
| **CodeBuild**                 | Biên dịch và kiểm thử tự động          | Trần Huy     | Trung bình  | Trung bình    | Tìm hiểu   |
| **WAF**                       | Bảo vệ ứng dụng web                    | Minh Hùng    | Cao         | Cao           | Done       |
| **Shield**                    | Bảo vệ chống DDoS                      | Trần Huy     | Thấp        | Trung bình    | Bắt buộc   |
| **AWS Backup**                | Giải pháp sao lưu tập trung            | Phan Hưng    | Trung bình  | Cao           | Bắt buộc   |
| **AWS Cost Explorer**         | Theo dõi và phân tích chi phí          | Khánh        | Trung bình  | Cao           | Bắt buộc   |

## Phân công nhiệm vụ

### Giai đoạn 1: Chuẩn bị và Thiết lập (Ngày 1-3)

| Nhiệm vụ                                   | Người phụ trách | Thời gian (ngày) | Yêu cầu kiến thức                | Ưu tiên |
| ------------------------------------------ | --------------- | ---------------- | -------------------------------- | ------- |
| Thiết lập AWS Account và IAM Users/Roles   | Huy Tú          | 1                | AWS IAM, Security Best Practices | Cao     |
| Cấu hình VPC, Subnets, Security Groups     | Hoàng Hưng      | 1                | AWS Networking                   | Cao     |
| Thiết lập S3 Buckets cho frontend và media | Đinh Tú         | 1                | S3, CloudFront                   | Cao     |
| Cấu hình CI/CD với CodePipeline            | Luân            | 2                | AWS CI/CD, GitHub Integration    | Cao     |

### Giai đoạn 2: Triển khai Cơ sở dữ liệu và Backend (Ngày 4-7)

| Nhiệm vụ                                  | Người phụ trách | Thời gian (ngày) | Yêu cầu kiến thức                | Ưu tiên |
| ----------------------------------------- | --------------- | ---------------- | -------------------------------- | ------- |
| Cấu hình RDS Multi-AZ và ElastiCache      | Luân            | 2                | AWS Database services, HA design | Cao     |
| Xây dựng và đẩy Docker Images lên ECR     | Tao             | 1                | Docker, ECR                      | Cao     |
| Cấu hình ECS Fargate Clusters và Services | Tao             | 2                | ECS, Fargate, Docker             | Cao     |
| Thiết lập Application Load Balancer       | Hoàng Hưng      | 1                | ELB, ALB, Target Groups          | Cao     |
| Cấu hình WAF và Shield                    | Minh Hùng       | 1                | WAF, Security                    | Cao     |
| Thiết lập CloudWatch Monitoring           | Đạt             | 1                | CloudWatch, Metrics              | Cao     |

### Giai đoạn 3: Triển khai Frontend (Ngày 8-10)

| Nhiệm vụ                             | Người phụ trách | Thời gian (ngày) | Yêu cầu kiến thức               | Ưu tiên |
| ------------------------------------ | --------------- | ---------------- | ------------------------------- | ------- |
| Build và triển khai Next.js Frontend | Đinh Tú         | 2                | Next.js, S3, CloudFront         | Cao     |
| Build và triển khai Admin Frontend   | Đinh Tú         | 2                | Next.js, S3, CloudFront         | Cao     |
| Cấu hình CloudFront và SSL           | Đinh Tú         | 1                | CloudFront, Certificate Manager | Cao     |

### Giai đoạn 4: Tích hợp và Kiểm thử (Ngày 11-13)

| Nhiệm vụ                      | Người phụ trách | Thời gian (ngày) | Yêu cầu kiến thức  | Ưu tiên |
| ----------------------------- | --------------- | ---------------- | ------------------ | ------- |
| Tích hợp Frontend với Backend | Đinh Tú, Tao    | 2                | API Integration    | Cao     |
| Kiểm thử End-to-End           | Toàn bộ team    | 2                | Testing strategies | Cao     |
| Cấu hình AWS Backup           | Phan Hưng       | 1                | Backup strategies  | Cao     |

### Giai đoạn 5: Giám sát và Tối ưu (Ngày 14-15)

| Nhiệm vụ                                 | Người phụ trách | Thời gian (ngày) | Yêu cầu kiến thức            | Ưu tiên |
| ---------------------------------------- | --------------- | ---------------- | ---------------------------- | ------- |
| Cấu hình CloudWatch Dashboards và Alarms | Đạt             | 1                | CloudWatch, Metrics, Logging | Cao     |
| Cấu hình Auto Scaling                    | Hoàng Hưng      | 1                | Auto Scaling strategies      | Cao     |
| Tối ưu hiệu suất hệ thống                | Toàn bộ team    | 1                | Performance optimization     | Cao     |

## Chi tiết triển khai

### 1. Thiết lập AWS Account và IAM

```bash
# Tạo IAM Users cho từng thành viên trong nhóm
aws iam create-user --user-name huy-tu
aws iam create-user --user-name hoang-hung
aws iam create-user --user-name dinh-tu
aws iam create-user --user-name tao
aws iam create-user --user-name luan
aws iam create-user --user-name minh-hung
aws iam create-user --user-name tran-huy
aws iam create-user --user-name phan-hung
aws iam create-user --user-name dat

# Tạo IAM Groups và gán policies phù hợp
aws iam create-group --group-name Administrators
aws iam create-group --group-name Developers
aws iam create-group --group-name DevOps

# Tạo IAM Roles cho services
aws iam create-role --role-name ecsTaskExecutionRole --assume-role-policy-document file://trust-policy.json
```

### 2. Cấu hình VPC và Networking

```bash
# Tạo VPC
aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=MovieWebsiteVPC}]'

# Tạo Public và Private Subnets trong hai AZs
aws ec2 create-subnet --vpc-id vpc-id --cidr-block 10.0.1.0/24 --availability-zone us-east-1a
aws ec2 create-subnet --vpc-id vpc-id --cidr-block 10.0.2.0/24 --availability-zone us-east-1b
aws ec2 create-subnet --vpc-id vpc-id --cidr-block 10.0.3.0/24 --availability-zone us-east-1a
aws ec2 create-subnet --vpc-id vpc-id --cidr-block 10.0.4.0/24 --availability-zone us-east-1b
```

### 3. Triển khai RDS và ElastiCache

```bash
# Tạo RDS Subnet Group
aws rds create-db-subnet-group --db-subnet-group-name movie-website-db-subnet --subnet-ids subnet-id-1 subnet-id-2 --description "Subnet group for Movie Website RDS"

# Tạo RDS Instance với Multi-AZ
aws rds create-db-instance \
  --db-name moviewebsite \
  --db-instance-identifier movie-website-db \
  --engine postgres \
  --master-username admin \
  --master-user-password your-password \
  --db-instance-class db.t3.small \
  --allocated-storage 20 \
  --multi-az \
  --backup-retention-period 7 \
  --db-subnet-group-name movie-website-db-subnet \
  --vpc-security-group-ids sg-id

# Tạo ElastiCache Cluster
aws elasticache create-cache-subnet-group --cache-subnet-group-name movie-website-cache-subnet --description "Subnet group for Movie Website ElastiCache" --subnet-ids subnet-id-1 subnet-id-2

aws elasticache create-replication-group \
  --replication-group-id movie-website-cache \
  --replication-group-description "Redis cache for Movie Website" \
  --num-cache-clusters 2 \
  --cache-node-type cache.t3.small \
  --engine redis \
  --cache-subnet-group-name movie-website-cache-subnet \
  --security-group-ids sg-id
```

### 4. Cấu hình Application Load Balancer và ECS

```bash
# Tạo Load Balancer
aws elbv2 create-load-balancer \
  --name movie-website-alb \
  --subnets subnet-id-1 subnet-id-2 \
  --security-groups sg-id \
  --scheme internet-facing \
  --type application

# Tạo Target Group
aws elbv2 create-target-group \
  --name movie-website-target-group \
  --protocol HTTP \
  --port 80 \
  --vpc-id vpc-id \
  --target-type ip \
  --health-check-path /health \
  --health-check-interval-seconds 30

# Tạo Listener
aws elbv2 create-listener \
  --load-balancer-arn lb-arn \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn=target-group-arn

# Thêm HTTPS Listener (sử dụng với ACM)
aws elbv2 create-listener \
  --load-balancer-arn lb-arn \
  --protocol HTTPS \
  --port 443 \
  --ssl-policy ELBSecurityPolicy-2016-08 \
  --certificates CertificateArn=certificate-arn \
  --default-actions Type=forward,TargetGroupArn=target-group-arn

# Tạo ECR Repository
aws ecr create-repository --repository-name movie-website-backend

# Build và Push Docker Image
docker build -t movie-website-backend ./backend
aws ecr get-login-password | docker login --username AWS --password-stdin account-id.dkr.ecr.region.amazonaws.com
docker tag movie-website-backend:latest account-id.dkr.ecr.region.amazonaws.com/movie-website-backend:latest
docker push account-id.dkr.ecr.region.amazonaws.com/movie-website-backend:latest

# Tạo ECS Cluster
aws ecs create-cluster --cluster-name movie-website-cluster

# Tạo Task Definition
aws ecs register-task-definition --cli-input-json file://task-definition.json

# Tạo ECS Service liên kết với ALB
aws ecs create-service \
  --service-name movie-website-backend-service \
  --cluster movie-website-cluster \
  --task-definition movie-website-backend:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-id-1,subnet-id-2],securityGroups=[sg-id],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=target-group-arn,containerName=movie-website-backend,containerPort=3000" \
  --deployment-configuration "minimumHealthyPercent=100,maximumPercent=200" \
  --health-check-grace-period-seconds 60
```

### 5. Triển khai Frontend trên S3 và CloudFront

```bash
# Tạo S3 Bucket cho Frontend
aws s3 mb s3://movie-website-frontend

# Build Frontend
cd frontend
npm run build

# Upload Frontend lên S3
aws s3 sync out/ s3://movie-website-frontend

# Tạo CloudFront Distribution
aws cloudfront create-distribution --origin-domain-name movie-website-frontend.s3.amazonaws.com

# Tạo S3 Bucket cho Admin Frontend
aws s3 mb s3://movie-website-admin

# Build và Upload Admin Frontend
cd ../admin-fe
npm run build
aws s3 sync out/ s3://movie-website-admin

# Tạo CloudFront Distribution cho Admin
aws cloudfront create-distribution --origin-domain-name movie-website-admin.s3.amazonaws.com
```

### 6. Cấu hình WAF và Shield

```bash
# Cấu hình AWS WAF
aws wafv2 create-web-acl \
  --name MovieWebsiteWAF \
  --scope REGIONAL \
  --default-action Allow={} \
  --visibility-config SampledRequestsEnabled=true,CloudWatchMetricsEnabled=true,MetricName=MovieWebsiteWAFMetrics \
  --rules file://waf-rules.json \
  --region your-region

aws wafv2 associate-web-acl \
  --web-acl-arn web-acl-arn \
  --resource-arn load-balancer-arn \
  --region your-region

# Kích hoạt AWS Shield
aws shield subscribe
```

### 7. Cấu hình CloudWatch Monitoring

```bash
# Tạo CloudWatch Dashboard
aws cloudwatch put-dashboard --dashboard-name "MovieWebsiteDashboard" --dashboard-body file://dashboard.json

# Tạo CloudWatch Alarms
aws cloudwatch put-metric-alarm \
  --alarm-name "HighCPUUtilization" \
  --alarm-description "High CPU utilization for ECS tasks" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 60 \
  --threshold 70 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=ServiceName,Value=movie-website-backend-service Name=ClusterName,Value=movie-website-cluster

# Cấu hình Auto Scaling cho ECS Service
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --scalable-dimension ecs:service:DesiredCount \
  --resource-id service/movie-website-cluster/movie-website-backend-service \
  --min-capacity 2 \
  --max-capacity 10

aws application-autoscaling put-scaling-policy \
  --service-namespace ecs \
  --scalable-dimension ecs:service:DesiredCount \
  --resource-id service/movie-website-cluster/movie-website-backend-service \
  --policy-name cpu-tracking-scaling-policy \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration file://scaling-policy.json
```

### 8. Cấu hình AWS Backup

```bash
# Tạo Backup Plan
aws backup create-backup-plan --backup-plan file://backup-plan.json

# Tạo Backup Vault
aws backup create-backup-vault --backup-vault-name movie-website-backup-vault

# Liên kết Resources với Backup Plan
aws backup create-backup-selection \
  --backup-plan-id plan-id \
  --backup-selection file://backup-selection.json
```

## Chiến lược giám sát và vận hành

### Giám sát

- **Dashboard chính** - Tổng quan về tất cả thành phần
- **Metrics chủ yếu**:
  - ECS: CPU/Memory Utilization
  - RDS: Database Connections, IOPS
  - ALB: Latency, Error rates
  - CloudFront: Cache hit ratio, Origin latency

### Cảnh báo

- **Độ ưu tiên cao**:
  - Lỗi 5xx > 5% trong 5 phút
  - Thời gian phản hồi API > 2s
  - CPU Utilization > 80% trong 10 phút
  - Database Connections > 80% của max
- **Độ ưu tiên trung bình**:
  - Lỗi 4xx > 10% trong 10 phút
  - Cache hit ratio < 60%

### Chiến lược sao lưu

- RDS: Bật automated backups, retention period 7 ngày
- S3: Versioning cho tất cả buckets
- Database Snapshots hàng ngày

## Đảm bảo đáp ứng Rubric

### 1. Hiểu mô hình triển khai ứng dụng đám mây và AWS (1.00 điểm)

- Sử dụng mô hình multi-tier với Frontend/Backend tách biệt
- Triển khai container hóa với ECS Fargate
- Tận dụng CDN và caching

### 2. Quản lý dự án và làm việc nhóm (4 điểm)

- Phân công nhiệm vụ rõ ràng cho từng thành viên
- Mốc thời gian cụ thể cho từng giai đoạn
- Chiến lược review và kiểm thử

### 3. Sử dụng công cụ thiết kế & triển khai ứng dụng đám mây (2.00 điểm)

- Tích hợp CI/CD với CodePipeline và CodeBuild
- Thiết kế kiến trúc bền vững với HA và fault tolerance

### 4-5-6. Áp dụng kiến thức chuyên ngành và ngôn ngữ lập trình (4+4+4 điểm)

- Tối ưu hóa mạng với CloudFront
- Bảo mật đa lớp với WAF, Security Groups, IAM
- Liên kết và cấu hình nhiều dịch vụ AWS
- Sử dụng Docker, Node.js, Next.js hiệu quả

### 7. Giải thích AWS Service & mô hình triển khai (1.00 điểm)

- Tài liệu chi tiết về kiến trúc hệ thống
- Sơ đồ mô tả tương tác giữa các dịch vụ

### 8. Quản lý tài nguyên dự án trên AWS (3.00 điểm)

- Chiến lược Auto Scaling cho ECS và RDS
- Cấu hình IAM Roles/Policies theo least privilege
- Monitoring và logging toàn diện

### 9. Kết hợp & cấu hình dịch vụ đám mây (3.00 điểm)

- Tích hợp nhiều dịch vụ AWS thành một hệ thống hoàn chỉnh
- Cấu hình Cross-service connectivity (VPC Endpoints, IAM)
- Tối ưu chi phí vận hành

### 10. Tư duy logic & biện chứng giải quyết vấn đề (4 điểm)

- Phân tích yêu cầu hệ thống cẩn thận
- Thiết kế kiến trúc có khả năng mở rộng
- Chiến lược backup và disaster recovery

## Các nâng cấp và tối ưu hóa

### Cân bằng tải và Tính sẵn sàng cao

1. **Application Load Balancer (ALB)**

   - Cân bằng tải HTTP/HTTPS thông minh
   - Path-based routing cho nhiều microservices
   - Sticky sessions cho trải nghiệm người dùng nhất quán
   - Health checks tự động loại bỏ instance lỗi
   - Tích hợp với ECS và Auto Scaling

2. **Multi-AZ Deployment**
   - RDS Multi-AZ cho tính sẵn sàng cao của database
   - ElastiCache Replication Groups với các node ở nhiều AZ
   - ECS Services triển khai trên nhiều Availability Zones
   - Cross-zone load balancing đảm bảo phân phối lưu lượng đồng đều

### Bảo mật và Tuân thủ

1. **Bảo vệ tăng cường**

   - AWS Shield Standard và Advanced chống DDoS
   - AWS WAF với rule sets tùy chỉnh chống OWASP Top 10
   - GuardDuty cho giám sát bảo mật liên tục
   - AWS Security Hub tập trung quản lý bảo mật

2. **Quản lý quyền truy cập**
   - IAM Access Analyzer phát hiện quyền truy cập quá mức
   - AWS Organizations SCP (Service Control Policies)
   - AWS SSO cho quản lý truy cập tập trung

### Tối ưu chi phí và hiệu suất

1. **Cơ chế tiết kiệm chi phí**

   - Auto Scaling theo lịch và theo nhu cầu
   - Savings Plans cho Fargate
   - Reserved Instances cho RDS và ElastiCache
   - AWS Cost Explorer và Budgets giám sát chi phí

2. **Tối ưu hiệu suất**
   - CloudFront Edge Caching và Origin Shield
   - ElastiCache cho caching
   - DynamoDB Accelerator (DAX) làm tầng caching

### Disaster Recovery

1. **Chiến lược DR**

   - Pilot Light với AWS Backup
   - RDS Cross-Region Read Replicas
   - S3 Cross-Region Replication
   - Route 53 failover routing policies

2. **Phục hồi dữ liệu**
   - RDS point-in-time recovery
   - DynamoDB point-in-time recovery
   - S3 Versioning và lifecycle policies
   - AWS Backup trung tâm quản lý sao lưu

### DevOps và CI/CD nâng cao

1. **Tự động hóa hoàn toàn**

   - CodePipeline với việc triển khai Zero-Downtime
   - Canary Deployments với Lambda và API Gateway
   - Infrastructure as Code bằng AWS CDK thay vì CloudFormation thuần túy

2. **Giám sát và Observability**
   - Amazon DevOps Guru cho machine learning-powered insights
   - CloudWatch Container Insights cho ECS/Fargate
   - CloudWatch Synthetics tạo Canaries giám sát
   - X-Ray tracing end-to-end

---

**Lưu ý quan trọng**: Kế hoạch này được thiết kế để đáp ứng tối đa các yêu cầu trong Rubric. Trong quá trình triển khai thực tế, có thể cần điều chỉnh dựa trên yêu cầu cụ thể và phản hồi từ giảng viên.
