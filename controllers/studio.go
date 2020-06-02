package controllers

import (
	"astaxie/beego/logs"
	"encoding/json"
	"strconv"
	"ttms/models"
)

type StudioController struct {
	BaseController
}

func (c *StudioController )InsertStudio() {
	logs.Debug("添加演出厅")

	data := models.Studio{}
	c.resp = make(map[string]interface{})
	defer c.sendJSON(c.resp)

	//检查权限
	if ok := c.JudgeAuthority(models.MG_STU); !ok {
		return
	}

	logs.Debug("%s",c.Ctx.Input.RequestBody)
	//获取前端数据
	if err:=json.Unmarshal(c.Ctx.Input.RequestBody,&data);err != nil{
		logs.Error(err)
		c.PackRecode(c.resp,models.RECODE_NODATA)
		return
	}

	logs.Debug("收到的影厅信息",data,data.StuName)

	//添加可用座位数量
	switch data.StuSize {
	case 1:
		data.StuAvaSeat =  25
		//添加座位信息
		insertSeat(5,5,&data)
	case 2:
		data.StuAvaSeat = 49
		//添加座位信息
		insertSeat(7,7,&data)
	case 3:
		data.StuAvaSeat = 100
		//添加座位信息
		insertSeat(10,10,&data)
	}


	//插入数据库
	_,err := models.InsertByTableName("studio",&data)
	if err != nil {
		c.PackRecode(c.resp,models.RECODE_DBERR) //4001 数据库插入错误
		logs.Error(err)
		return
	}


	//返回信息
	c.PackRecode(c.resp,models.RECODE_OK) //成功插入数据库

}

/*
添加座位
 */
func insertSeat(row, col int64,stu *models.Studio) {
	var i,j int64
	for  i = 1;i <= row;i++ {
		for j = 1;j <= col;j++ {
			seat := models.Seat{StRow:i,StCol:j,Studio:stu}
			models.InsertByTableName(models.SEAT,&seat)
		}
	}
}
func (c *StudioController)DeleteStudio() {

	logs.Debug("删除演出厅")
	c.resp = make(map[string]interface{})
	defer c.sendJSON(c.resp)

	//检查权限
	if ok := c.JudgeAuthority(models.MG_STU); !ok {
		return
	}

	data := models.Studio{}

	id,err := c.GetInt64("stu_id")
	if err != nil {
		c.PackRecode(c.resp,models.RECODE_NODATA) //4002 没有收到ID
		return
	}

	logs.Debug("要删除的演出厅的ID",id)
	data.StuId = id
	_,err2 := models.DeleteByTablename(models.STUDIO,&data)
	if err2 != nil {
		c.PackRecode(c.resp,models.RECODE_DBERR) //4001 数据库出错
		return
	}

	c.PackRecode(c.resp,models.RECODE_OK)
}

func (c *StudioController) GetStudioData() {
	c.resp = make(map[string]interface{})
	defer c.sendJSON(c.resp)

	//验证权限
	if ok := c.JudgeAuthority(models.MG_STU); !ok {
		return
	}

	pageStr := c.Ctx.Input.Param(":page")
	page,_ := strconv.Atoi(pageStr)
	logs.Debug("获取影厅信息第",page,"页")

	slice := []models.Studio{}
	//返回情况返回相应数据
	//models.T()
	err,sum,ret2 := models.GetDataByNumAndOffset(models.STUDIO,&slice,10,(page-1)*10,"stu_type")
	if err != nil || ret2 == 0{
		logs.Error("查询n条数据出错")
		c.resp["sum"] = 0
		c.PackRecode(c.resp,models.RECODE_DBERR) //数据库错误
		return
	}

	c.PackRecode(c.resp,models.RECODE_OK)
	c.resp["sum"] = sum
	c.resp["data"] = slice
	logs.Debug("从数据库存中获得数据",slice)
	logs.Debug(c.resp)
}

func (c *StudioController)UpdateStudio() {

	logs.Debug("更新影厅信息")
	c.resp = make(map[string]interface{})
	defer c.sendJSON(c.resp)

	if ok := c.JudgeAuthority(models.MG_STU); !ok {
		return
	}


	data := models.Studio{}
	json.Unmarshal(c.Ctx.Input.RequestBody,&data)
	logs.Debug("从前段获取的数据是",data)

	//判断roww和col是否改变
	s := models.Studio{StuId:data.StuId}
	err1 := models.GetDataById(models.STUDIO,&s)
	if err1 != nil {
		c.PackRecode(c.resp,models.RECODE_DBERR) //4001 数据库查询错误　
		return
	}

	//判断座位是否需要重新载入
	if s.StuSize== data.StuSize {
		//修改
		err := models.UpdateByTablename(models.STUDIO,&data)
		//返回结果
		if err != nil {
			c.PackRecode(c.resp,models.RECODE_DBERR) //4001　插入失败
			return
		}
		logs.Debug("座位信息未修改")
	}else {
		logs.Debug("修改了座位信息")
		//删除座位
		//删除时候必须有主键
		_,err2 := models.DeleteByTablename(models.STUDIO,&s)
		if err2 != nil {
			logs.Error(err2)
			c.PackRecode(c.resp,models.RECODE_DBERR)
			return
		}

		//重新插入
		//添加可用座位数量
		switch data.StuSize {
		case 1:
			data.StuAvaSeat =  25
			//添加座位信息
			insertSeat(5,5,&data)
		case 2:
			data.StuAvaSeat = 49
			//添加座位信息
			insertSeat(7,7,&data)
		case 3:
			data.StuAvaSeat = 100
			//添加座位信息
			insertSeat(10,10,&data)
		}
		models.InsertByTableName(models.STUDIO,&data)
	}

	/*

	 */

	c.PackRecode(c.resp,models.RECODE_OK)


}

/*
用于搜索影厅时候的模糊匹配,实现搜索提示
*/
func (c *StudioController) GetHint() {
	logs.Debug("查询影厅,模糊搜索获取提示")
	//开辟map
	c.resp = make(map[string]interface{})
	defer c.sendJSON(c.resp)

	//检查权限
	if ok := c.JudgeAuthority(models.MG_QUERY_STU); !ok {
		return
	}

	//解析参数
	hint := c.GetString("stu_hint")
	logs.Debug("要搜索的字符是",hint)

	//从数据库中查询
	var container []models.Studio
	num,err := models.GetHintByFieldAndValue(models.STUDIO,"stu_name",hint,&container)

	if num == 0 || err != nil {
		logs.Error(err)
		c.PackRecode(c.resp,models.RECODE_NODATA) //4002无数据
		return
	}

	logs.Debug("影厅查询模糊查询到的结果是",container)

	//包装成字符串数组
	c.PackStuName(c.resp,container)
	//返回状态代码
	c.resp["sum"] = num
	c.PackRecode(c.resp,models.RECODE_OK)

}

/*
通过名字来返回符合要求的影厅
也是模糊搜索
*/
func (c *StudioController) GetStudioByName() {
	logs.Debug("按照全名模糊搜索")
	//开辟map
	c.resp = make(map[string]interface{})
	defer c.sendJSON(c.resp)

	//检查权限
	if ok := c.JudgeAuthority(models.MG_QUERY_STU); !ok {
		return
	}

	//解析参数
	name := c.GetString("stu_name")
	logs.Debug("要搜索的全名是",name)

	//从数据库中查询
	var container []models.Studio
	num,err := models.GetHintByFieldAndValue(models.STUDIO,"stu_name",name,&container)

	if num == 0 || err != nil {
		logs.Error(err)
		c.PackRecode(c.resp,models.RECODE_NODATA) //4002无数据
		return
	}

	logs.Debug("全名查询到的结果是",container)

	//包装数组对象
	c.resp["data"] = container
	//返回状态代码
	c.resp["sum"] = num
	c.PackRecode(c.resp,models.RECODE_OK)
}



/*
提取结构提中的名字信息，打包成data发送
*/
func (c *StudioController)PackStuName(resp map[string]interface{},container []models.Studio)  {
	m := make([]string,0)

	for _,stu:= range container {
		m = append(m,stu.StuName)
	}
	resp["data"] = m
}
