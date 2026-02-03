# IT服务平台API接口设计

## 1. 接口规范

### 1.1 基础配置

- **基础URL**: `/api/v1`
- **认证方式**: Bearer Token
- **请求格式**: JSON
- **响应格式**: JSON
- **字符编码**: UTF-8

### 1.2 统一响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": {},
  "timestamp": 1640995200000
}
```

### 1.3 状态码规范

- `200`: 成功
- `400`: 请求参数错误
- `401`: 未认证
- `403`: 无权限
- `404`: 资源不存在
- `500`: 服务器错误

## 2. 认证模块 API

### 2.1 用户注册

```javascript
// POST /api/v1/auth/register
{
  "username": "string",
  "email": "string", 
  "password": "string",
  "confirmPassword": "string",
  "phone": "string",
  "captcha": "string"
}

// Response
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "userId": 1001,
    "username": "testuser"
  }
}
```

### 2.2 用户登录

```javascript
// POST /api/v1/auth/login
{
  "username": "string", // 用户名或邮箱
  "password": "string",
  "captcha": "string"
}

// Response
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_string",
    "user": {
      "id": 1001,
      "username": "testuser",
      "email": "test@example.com",
      "role": "user",
      "avatar": "avatar_url"
    }
  }
}
```

### 2.3 刷新Token

```javascript
// POST /api/v1/auth/refresh
{
  "refreshToken": "string"
}
```

## 3. 用户模块 API

### 3.1 获取用户信息

```javascript
// GET /api/v1/user/profile
// Headers: Authorization: Bearer {token}

// Response
{
  "code": 200,
  "data": {
    "id": 1001,
    "username": "testuser",
    "email": "test@example.com",
    "phone": "13800138000",
    "avatar": "avatar_url",
    "role": "user",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00Z",
    "profile": {
      "nickname": "测试用户",
      "bio": "个人简介",
      "location": "北京",
      "website": "https://example.com"
    }
  }
}
```

### 3.2 更新用户信息

```javascript
// PUT /api/v1/user/profile
{
  "nickname": "string",
  "bio": "string",
  "location": "string",
  "website": "string"
}
```

### 3.3 关注/取消关注

```javascript
// POST /api/v1/user/follow/{userId}
// DELETE /api/v1/user/follow/{userId}

// Response
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "isFollowing": true,
    "followersCount": 100
  }
}
```

## 4. 文章模块 API

### 4.1 文章列表

```javascript
// GET /api/v1/articles?page=1&size=10&category=tech&tag=vue

// Response
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": 1001,
        "title": "Vue 3 最佳实践",
        "summary": "文章摘要...",
        "content": "文章内容...",
        "coverImage": "image_url",
        "category": "tech",
        "tags": ["vue", "frontend"],
        "author": {
          "id": 2001,
          "username": "author",
          "avatar": "avatar_url"
        },
        "stats": {
          "views": 1000,
          "likes": 50,
          "comments": 10
        },
        "status": "published",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "size": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

### 4.2 创建文章

```javascript
// POST /api/v1/articles
{
  "title": "string",
  "content": "string",
  "summary": "string",
  "coverImage": "string",
  "category": "string",
  "tags": ["string"],
  "status": "draft" // draft, published
}
```

### 4.3 文章详情

```javascript
// GET /api/v1/articles/{id}

// Response
{
  "code": 200,
  "data": {
    "id": 1001,
    "title": "Vue 3 最佳实践",
    "content": "完整文章内容...",
    "author": {
      "id": 2001,
      "username": "author",
      "avatar": "avatar_url",
      "followersCount": 1000
    },
    "stats": {
      "views": 1000,
      "likes": 50,
      "comments": 10
    },
    "isLiked": false,
    "isFavorited": false,
    "isFollowingAuthor": false,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

## 5. 服务模块 API

### 5.1 服务列表

```javascript
// GET /api/v1/services?page=1&size=12&category=web&minPrice=100&maxPrice=5000&sortBy=price

// Response
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": 3001,
        "title": "网站开发服务",
        "description": "专业网站开发...",
        "coverImage": "image_url",
        "category": "web",
        "tags": ["网站", "开发"],
        "price": 2000,
        "originalPrice": 2500,
        "deliveryDays": 7,
        "provider": {
          "id": 4001,
          "username": "provider",
          "avatar": "avatar_url",
          "rating": 4.8,
          "completedOrders": 100
        },
        "stats": {
          "sales": 50,
          "rating": 4.9,
          "reviews": 20
        },
        "status": "active",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "size": 12,
      "total": 120,
      "totalPages": 10
    },
    "filters": {
      "categories": [
        {"id": "web", "name": "网站开发", "count": 50},
        {"id": "mobile", "name": "移动应用", "count": 30}
      ],
      "priceRange": {
        "min": 100,
        "max": 10000
      }
    }
  }
}
```

### 5.2 创建服务

```javascript
// POST /api/v1/services
{
  "title": "string",
  "description": "string",
  "coverImage": "string",
  "images": ["string"],
  "category": "string",
  "tags": ["string"],
  "price": 2000,
  "originalPrice": 2500,
  "deliveryDays": 7,
  "features": ["功能1", "功能2"],
  "requirements": "需求说明",
  "faq": [
    {
      "question": "问题",
      "answer": "答案"
    }
  ]
}
```

### 5.3 服务详情

```javascript
// GET /api/v1/services/{id}

// Response包含完整服务信息、提供商信息、评价列表等
```

## 6. 订单模块 API

### 6.1 创建订单

```javascript
// POST /api/v1/orders
{
  "serviceId": 3001,
  "quantity": 1,
  "requirements": "具体需求说明",
  "deliveryDate": "2024-02-01",
  "contactInfo": {
    "phone": "13800138000",
    "email": "user@example.com"
  }
}

// Response
{
  "code": 200,
  "data": {
    "orderId": "ORD202401010001",
    "amount": 2000,
    "paymentUrl": "payment_url"
  }
}
```

### 6.2 订单列表

```javascript
// GET /api/v1/orders?page=1&size=10&status=pending

// Response
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": "ORD202401010001",
        "service": {
          "id": 3001,
          "title": "网站开发服务",
          "coverImage": "image_url"
        },
        "provider": {
          "id": 4001,
          "username": "provider",
          "avatar": "avatar_url"
        },
        "amount": 2000,
        "status": "pending", // pending, paid, in_progress, completed, cancelled
        "deliveryDate": "2024-02-01",
        "createdAt": "2024-01-01T00:00:00Z",
        "timeline": [
          {
            "status": "created",
            "time": "2024-01-01T00:00:00Z",
            "description": "订单创建"
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "size": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

### 6.3 订单详情

```javascript
// GET /api/v1/orders/{orderId}

// Response包含完整订单信息、服务详情、沟通记录等
```

## 7. 悬赏模块 API

### 7.1 发布悬赏

```javascript
// POST /api/v1/bounties
{
  "title": "string",
  "description": "string",
  "category": "string",
  "tags": ["string"],
  "budget": 5000,
  "deadline": "2024-02-01",
  "requirements": "详细需求",
  "attachments": ["file_url"],
  "skills": ["技能1", "技能2"]
}
```

### 7.2 悬赏列表

```javascript
// GET /api/v1/bounties?page=1&size=10&category=web&minBudget=1000

// Response格式类似服务列表
```

### 7.3 投标悬赏

```javascript
// POST /api/v1/bounties/{id}/bids
{
  "proposal": "方案说明",
  "budget": 4000,
  "deliveryDays": 10,
  "attachments": ["file_url"]
}
```

## 8. 论坛模块 API

### 8.1 帖子列表

```javascript
// GET /api/v1/forum/posts?page=1&size=20&category=tech&sortBy=latest

// Response
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": 5001,
        "title": "Vue 3 问题求助",
        "content": "帖子内容...",
        "category": "tech",
        "tags": ["vue", "help"],
        "author": {
          "id": 6001,
          "username": "user",
          "avatar": "avatar_url"
        },
        "stats": {
          "views": 100,
          "replies": 5,
          "likes": 10
        },
        "isSticky": false,
        "isLocked": false,
        "lastReplyAt": "2024-01-01T00:00:00Z",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

### 8.2 发布帖子

```javascript
// POST /api/v1/forum/posts
{
  "title": "string",
  "content": "string",
  "category": "string",
  "tags": ["string"],
  "attachments": ["file_url"]
}
```

### 8.3 回复帖子

```javascript
// POST /api/v1/forum/posts/{id}/replies
{
  "content": "string",
  "replyTo": 7001, // 回复的评论ID，可选
  "attachments": ["file_url"]
}
```

## 9. 管理员模块 API

### 9.1 用户管理

```javascript
// GET /api/v1/admin/users?page=1&size=20&role=user&status=active

// PUT /api/v1/admin/users/{id}/role
{
  "role": "provider" // user, provider, admin
}

// PUT /api/v1/admin/users/{id}/status
{
  "status": "banned" // active, banned, suspended
}
```

### 9.2 内容审核

```javascript
// GET /api/v1/admin/reviews/articles?status=pending
// GET /api/v1/admin/reviews/services?status=pending

// POST /api/v1/admin/reviews/articles/{id}/approve
// POST /api/v1/admin/reviews/articles/{id}/reject
{
  "reason": "拒绝原因"
}
```

### 9.3 数据统计

```javascript
// GET /api/v1/admin/statistics/overview

// Response
{
  "code": 200,
  "data": {
    "users": {
      "total": 10000,
      "newToday": 50,
      "activeToday": 1000
    },
    "orders": {
      "total": 5000,
      "todayAmount": 50000,
      "monthAmount": 1000000
    },
    "services": {
      "total": 2000,
      "pending": 50
    },
    "articles": {
      "total": 8000,
      "pending": 20
    }
  }
}
```

## 10. 文件上传 API

### 10.1 图片上传

```javascript
// POST /api/v1/upload/image
// Content-Type: multipart/form-data

// Response
{
  "code": 200,
  "data": {
    "url": "https://cdn.example.com/images/xxx.jpg",
    "filename": "xxx.jpg",
    "size": 102400
  }
}
```

### 10.2 文件上传

```javascript
// POST /api/v1/upload/file
// 支持文档、压缩包等文件类型
```

## 11. 消息通知 API

### 11.1 获取消息列表

```javascript
// GET /api/v1/notifications?page=1&size=20&type=system

// Response
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": 8001,
        "type": "system", // system, order, comment, like, follow
        "title": "系统通知",
        "content": "通知内容",
        "data": {}, // 额外数据
        "isRead": false,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "unreadCount": 5
  }
}
```

### 11.2 标记已读

```javascript
// PUT /api/v1/notifications/{id}/read
// PUT /api/v1/notifications/read-all
```

这份API设计文档涵盖了IT服务平台的核心功能接口，为前后端开发提供了清晰的接口规范。