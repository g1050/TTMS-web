package controllers

import (
	"astaxie/beego/logs"
	"encoding/json"
	"strconv"
	"ttms/models"
	_ "ttms/models"
)

//写进配置文件
const ROWTOSHOW = 10

type DataEmp struct {
	Employee []models.Employee`json:"employee"`
}

type UserController struct {
	BaseController
}

//批量获取,排序,分页显示
func (c *UserController)GetUserData() {
	resp := make(map[string]interface{})
	defer c.sendJSON(resp)

	pageStr := c.Ctx.Input.Param(":page")
	page,_ := strconv.Atoi(pageStr)
	logs.Debug("获取员工信息第",page,"页")

	slice := []models.Employee{}
	//返回情况返回相应数据
	//models.T()
	err,sum,ret2 := models.GetDataByNumAndOffset("employee",&slice,10,(page-1)*10,"emp_privilege")
	if err != nil || ret2 == 0{
		logs.Error("查询n条数据出错")
		resp["sum"] = 0
		c.PackRecode(resp,models.RECODE_DBERR) //数据库错误
		return
	}

	c.PackRecode(resp,models.RECODE_OK)
	resp["sum"] = sum
	resp["data"] = slice
	logs.Debug("从数据库存中获得数据",slice)
	logs.Debug(resp)
}

/*
单个插入
 */
func (c *UserController)InsertUserData() {
	resp := make(map[string]interface{})
	defer c.sendJSON(resp)
	//获取前段的数据
	data := models.Employee{}
	json.Unmarshal(c.Ctx.Input.RequestBody,&data)
	logs.Debug("前端口获得的数据是",data)

	//发给M层插入,返送指针类型
	err := models.InsertByTableName(models.EMPPLYEE,&data)
	if err != nil {
		c.PackRecode(resp,models.RECODE_DATAEXIST) //4003已经注册
		return
	}
	//返回结果
	c.PackRecode(resp,models.RECODE_OK) //成功
}

//批量插入,弃用
func (c *UserController)InsertUserDataMul() {
	resp := make(map[string]interface{})
	defer c.sendJSON(resp)

	//data的成员是Employee数组
	data := DataEmp{}
	json.Unmarshal(c.Ctx.Input.RequestBody,&data)
	logs.Debug("从前段获取的数组是",data)

	//发给models批量插入
	err,sucessNum := models.InsertMul(models.EMPPLYEE,&(data.Employee))
	if err != nil || sucessNum == 0{
		resp["num"] = sucessNum
		c.PackRecode(resp,models.RECODE_DBERR)
		return
	}
	resp["num"] = sucessNum
	c.PackRecode(resp,models.RECODE_OK) //请检查手机号是否已经注册

}

/*
更新用户数据
 */
func (c *UserController)UpdateUserData() {
	//获取用户数据
	resp := make(map[string]interface{})
	defer c.sendJSON(resp)

	data := models.Employee{}
	json.Unmarshal(c.Ctx.Input.RequestBody,&data)
	logs.Debug("从前段获取的数组是",data)

	//检查数据是否存在
	if ok := models.CheckExist(models.EMPPLYEE,"emp_phonenumber",data.EmpPhonenumber);!ok {
		//不存在该条数据
		c.PackRecode(resp,models.RECODE_USERERR) //4104 数据不存在
		return
	}

	//获取id
	data.EmpId = models.GetId(models.EMPPLYEE,"emp_phonenumber",data.EmpPhonenumber)
	//修改
	err := models.UpdateByTablename(models.EMPPLYEE,&data)
	//返回结果
	if err != nil {
		c.PackRecode(resp,models.RECODE_DBERR) //4001　插入失败
		return
	}
	c.PackRecode(resp,models.RECODE_OK)

}

/*
删除用户数据
 */
func (c *UserController)DeleteUserData() {
	//获取用户数据
	resp := make(map[string]interface{})
	defer c.sendJSON(resp)

	data := models.Employee{}
	data.EmpPhonenumber = c.GetString("emp_phonenumber")
	json.Unmarshal(c.Ctx.Input.RequestBody,&data)
	logs.Debug("从前段获取的数组是",data)

	//检查数据是否存在
	if ok := models.CheckExist(models.EMPPLYEE,"emp_phonenumber",data.EmpPhonenumber);!ok {
		//不存在该条数据
		c.PackRecode(resp,models.RECODE_USERERR) //4104 数据不存在
		return
	}

	//获取id
	data.EmpId = models.GetId(models.EMPPLYEE,"emp_phonenumber",data.EmpPhonenumber)
	//删除
	err := models.DeleteByTablename(models.EMPPLYEE,&data)
	//返回结果
	if err != nil {
		c.PackRecode(resp,models.RECODE_DBERR) //4001　插入失败
		return
	}
	c.PackRecode(resp,models.RECODE_OK)

}
