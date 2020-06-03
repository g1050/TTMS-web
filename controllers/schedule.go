package controllers

import (
	"encoding/json"
	"github.com/astaxie/beego/logs"
	"strconv"
	"ttms/models"
)

type ScheduleController struct {
	BaseController
}

/*
插入演出计划的信息
 */
func (c *ScheduleController)InsertSchedule()  {
	logs.Debug("添加演出计划")

	data := models.Schedule{}
	c.resp = make(map[string]interface{})
	defer c.sendJSON(c.resp)

	//检查权限
	if ok := c.JudgeAuthority(models.MG_SCH); !ok {
		return
	}

	logs.Debug("%s",c.Ctx.Input.RequestBody)
	//获取前端数据
	if err:=json.Unmarshal(c.Ctx.Input.RequestBody,&data);err != nil{
		logs.Error(err)
		c.PackRecode(c.resp,models.RECODE_NODATA)
		return
	}

	//构造studio和movie
	stu := models.Studio{StuId:data.SchStuId}
	mov := models.Movie{MovId:data.SchMovId}
	models.GetDataById(models.MOVIE,&mov)
	models.GetDataById(models.STUDIO,&stu)
	data.Movie = &mov
	data.Studio = &stu
	data.StuName = stu.StuName
	data.MovName = mov.MovName
	logs.Debug("收到的演出计划信息是",data)

	//把演出计划插入插入数据库
	_,err := models.InsertByTableName(models.SCHEDULE,&data)
	if err != nil {
		c.PackRecode(c.resp,models.RECODE_DBERR) //4001 数据库插入错误
		logs.Error(err)
		return
	}

	//生成相应的票
	//根据座位生成相应的代码
	//查询所有座位
	var seats []*models.Seat
	//获取座位信息
	num, err2 := models.QuertOneToMany(models.SEAT, "Studio", data.SchStuId, &seats)
	if err2 != nil {
		c.PackRecode(c.resp, models.RECODE_DBERR)
		return
	}
	logs.Debug("%d seats read\n", num)


	for _,value := range seats {
		//每个座位生成对应的票
		tic := models.Ticket{Seat:value}
		tic.TicMovId = data.SchMovId
		tic.TicSchId = data.SchId

		//给movname 和 stuname
		tic.TicMovName = mov.MovName
		tic.TicStuName = stu.StuName
		tic.TicPrice = data.SchPrice

		num,err := models.InsertByTableName(models.TICKET,&tic)
		logs.Debug("生成的票是",tic)
		if err != nil {
			logs.Debug(num,err)
			c.PackRecode(c.resp,models.RECODE_DBERR)
			return
		}
	}

	/*
	//添加多对多关系
	studio := models.Studio{StuId:data.SchStuId}
	_,err2 := models.AddManyToMany(models.SCHEDULE,"Studios",&data,studio)

	movie := models.Movie{MovId:data.SchMovId}
	_,err3 := models.AddManyToMany(models.SCHEDULE,"Movies",&data,movie)

	if err2 != nil || err3 != nil {
		logs.Error("err2 = ",err2,"\terr3 = ",err3)
		c.PackRecode(c.resp,models.RECODE_DBERR) //4001
		return
	}
	 */

	//返回信息
	c.PackRecode(c.resp,models.RECODE_OK) //成功插入数据库
}

func (c *ScheduleController)DeleteSchedule() {

	logs.Debug("删除演出计划")
	c.resp = make(map[string]interface{})
	defer c.sendJSON(c.resp)

	//检查权限
	if ok := c.JudgeAuthority(models.MG_SCH); !ok {
		return
	}

	data := models.Schedule{}

	id,err := c.GetInt64("sch_id")
	if err != nil {
		c.PackRecode(c.resp,models.RECODE_NODATA) //4002 没有收到ID
		return
	}

	logs.Debug("要删除的演出计划的ID",id)
	data.SchId = id

	/*
	//删除两个表中的关系
	models.ClearManyToMany(models.SCHEDULE,"Studios",&data)
	models.ClearManyToMany(models.SCHEDULE,"Movies",&data)
	 */

	_,err2 := models.DeleteByTablename(models.SCHEDULE,&data)
	if err2 != nil {
		c.PackRecode(c.resp, models.RECODE_DBERR) //4001 数据库出错
		return
	}

	c.PackRecode(c.resp,models.RECODE_OK)
}


/*
修改演出计划,注意重新修改电影和演出厅的对应关系

//生成的票要删掉,重新生成票
 */
func (c *ScheduleController)UpdateSchedule() {

	logs.Debug("更新放映计划信息")
	c.resp = make(map[string]interface{})
	defer c.sendJSON(c.resp)

	if ok := c.JudgeAuthority(models.MG_SCH); !ok {
		return
	}


	data := models.Schedule{}
	json.Unmarshal(c.Ctx.Input.RequestBody,&data)

	//构造
	stu := models.Studio{StuId:data.SchStuId}
	mov := models.Movie{MovId:data.SchMovId}
	data.Movie = &mov
	data.Studio = &stu
	logs.Debug("从前段获取的数据是",data)


	/*
	//判断演出厅和c电影是否改变
	s := models.Schedule{SchId:data.SchId}
	err1 := models.GetDataById(models.SCHEDULE,&s)
	if err1 != nil {
		c.PackRecode(c.resp,models.RECODE_DBERR) //4001 数据库查询错误　
		return
	}
	 */

	/*
	//判断是否改变
	if data.SchMovId != s.SchMovId { //电影发生变化
		//删除之前的对应关系
		models.ClearManyToMany(models.SCHEDULE,"Movies",&data)

		movie := models.Movie{MovId:data.SchMovId}
		_,err2 := models.AddManyToMany(models.SCHEDULE,"Movies",&data,movie)
		if err2 != nil {
			c.PackRecode(c.resp,models.RECODE_DBERR)
			return
		}
	}

	if data.SchStuId != s.SchStuId {
		//删除原来的对应关系
		models.ClearManyToMany(models.SCHEDULE,"Studios",&data)

		studio := models.Studio{StuId:data.SchStuId}
		_,err2 := models.AddManyToMany(models.SCHEDULE,"Studios",&data,studio)
		if err2 != nil {
			c.PackRecode(c.resp,models.RECODE_DBERR)
			return
		}
	}
	 */

	//修改
	err := models.UpdateByTablename(models.SCHEDULE,&data)
	//返回结果
	if err != nil {
		c.PackRecode(c.resp,models.RECODE_DBERR) //4001　插入失败
		return
	}
	c.PackRecode(c.resp,models.RECODE_OK)


}

/*
获取演出计划的信息
 */
func (c *ScheduleController) GetSchedule() {
	c.resp = make(map[string]interface{})
	defer c.sendJSON(c.resp)

	//验证权限
	if ok := c.JudgeAuthority(models.MG_QUERY_SCH); !ok {
		return
	}

	pageStr := c.Ctx.Input.Param(":page")
	page,_ := strconv.Atoi(pageStr)
	logs.Debug("获取放映计划信息第",page,"页")

	//slice中携带的信息太多，需要,挑选
	slice  := []models.Schedule{}

	err,sum,ret2 := models.GetDataByNumAndOffset(models.SCHEDULE,&slice,10,(page-1)*10,"sch_stu_id")
	if err != nil || ret2 == 0{
		logs.Error("查询n条数据出错")
		c.resp["sum"] = 0
		c.PackRecode(c.resp,models.RECODE_DBERR) //数据库错误
		return
	}

	/*
	//重新赋值StuName字段和MovName字段
	for index,value := range slice {
	 	slice[index].StuName = value.Studio.StuName
		slice[index].MovName = value.Movie.MovName
	}
	 */

	/*
	num,err := models.RelateQuery(models.SCHEDULE,&slice)
	if err != nil {
		logs.Error(err)
		c.PackRecode(c.resp,models.RECODE_DBERR)
		return
	}
	 */
	//关联查询

	/*
	//先查询所有的演出计划信息，不做关联查询
	err,sum,ret2 := models.GetDataByNumAndOffset(models.SCHEDULE,&slice,10,(page-1)*10,"sch_stu_id")
	if err != nil || ret2 == 0{
		logs.Error("查询n条数据出错")
		c.resp["sum"] = 0
		c.PackRecode(c.resp,models.RECODE_DBERR) //数据库错误
		return
	}

	for index,_ := range slice {
		//做关联查询,查询哪些用到了这个演出计划
		logs.Debug(index)

	}
	 */

	logs.Debug("从数据库存中获得数据",slice)
	c.resp["sum"] = sum
	c.resp["data"] = slice
	c.PackRecode(c.resp,models.RECODE_OK)
}


/*
根据电影ID查询,演出计划
用户购票时候
暂时不做分页处理
 */
func (c *ScheduleController) GetScheduleByMovie() {
	logs.Debug("购票时候查询演出计划")
	c.resp = make(map[string]interface{})
	defer c.sendJSON(c.resp)

	//验证权限
	if ok := c.JudgeAuthority(models.MG_QUERY_SCH); !ok {
		return
	}

	mov_id,_ := c.GetInt64("mov_id")
	logs.Debug("获取到的电影ID是",mov_id)



	//slice中携带的信息太多，需要,挑选
	slice := []models.Schedule{}
	num,err := models.GetDataByFieldAndValue(models.SCHEDULE,"movie_id",mov_id,&slice)

	if err != nil {
		c.PackRecode(c.resp,models.RECODE_DBERR)
		return
	}


	logs.Debug("从数据库存中获得数据", slice)
	c.resp["sum"] = num
	c.resp["data"] = slice
	c.PackRecode(c.resp, models.RECODE_OK)
}