# 开发日志
## 跨域问题
- 不能设置```AllowAllOrigins:  true```,或者```AllowOrigins: []string{"http://*.*.*.*:*"}```,设置通配符会导致浏览器收不到cookie
- 原因未知
## account模块
- 登录验证、获取session两个功能,基本没什么坑
- 在base基类中封装了MyPrepare函数，根据用户的session ID来获取session,判断用户和是否是登陆状态 
- controller负责处理数据，与数据库的增删改查交给models去处理,但是models层函数的返回值没有一个很好的规范,返回值每次都要不停变更,希望能找到一种规范的方式来返回信息，以及错误类型
## user模块
- 对用户信息的CRUD,不支持批量插入
- 密码采用明文传输和存储，存在安全性问题,后期是一个优化的点
- 后期要支持批量导出,和批量导入，最后借用excle模板文件来实现批量的导入，并且能批量导出
- 不支持按照某个字段排序
## studio模块
- 没什么坑和user模块很像,因为写了一个模板的增删改查(根据tablename增删改查),所以开发起来也比较快
>                                            写于2020-5-28
>
## movie模块
- 电影信息上传分为两次,第一次上传基本信息(不包含图片),成功上传后,返回ID,根据ID选择是否上传图片
- 图片采用go-fastdfs分布式存储,数据库中保存图片URL
## seat模块
- 添加演出厅的时候，生成所有座位,二者是一对多的关系,演出厅作为票的外键
- 座位状态在演出厅管理里修改,包括在修改演出厅的功能里
- 演出厅需要添加字段可用座位数

