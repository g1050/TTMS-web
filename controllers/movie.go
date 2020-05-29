package controllers

import (
	"astaxie/beego/logs"
	"encoding/json"
	"strconv"
	"ttms/models"
)

type MovieController struct {
	BaseController
}

/*
添加电影的基本信息
添加成功后返回电影的ID
 */
func (c *MovieController) InsertMovie() {
	 logs.Debug("添加电影信息")
	data := models.Movie{}
	str,_ := json.Marshal(data)
	logs.Debug("%s",str)
	 c.resp = make(map[string]interface{})
	 defer c.sendJSON(c.resp)


	//检查权限
	if ok := c.JudgeAuthority(models.MG_MOV); !ok {
		return
	}

	//获取前段数据
	if err:=json.Unmarshal(c.Ctx.Input.RequestBody,&data);err != nil{
		logs.Error(err); c.PackRecode(c.resp,models.RECODE_NODATA); return
	}

	logs.Debug("收到的电影信息",data)
	//插入数据库
	num,err := models.InsertByTableName(models.MOVIE,&data)
	if err != nil {
		c.PackRecode(c.resp,models.RECODE_DBERR) //4001 数据库插入错误
		logs.Error(err)
		return
	}

	//返回结果
	//添加ID信息
	c.resp["mov_id"] = num
	c.PackRecode(c.resp,models.RECODE_OK)

	return
}


func (c *MovieController) InsertMovieImage() {
	logs.Debug("添加电影图片")
	data := models.Movie{}
	str,_ := json.Marshal(data)
	logs.Debug("%s",str)
	c.resp = make(map[string]interface{})
	defer c.sendJSON(c.resp)


	//检查权限
	if ok := c.JudgeAuthority(models.MG_MOV); !ok {
		return
	}

	//获取URL中的参数
	idStr := c.Ctx.Input.Param(":id")
	id,_ := strconv.Atoi(idStr)
	logs.Debug("要添加图片的电影的ID是",id)

	//获取前段数据
	filedata,hd,err := c.GetFile("image");
	if err != nil{
		c.PackRecode(c.resp,models.RECODE_NODATA)
		return
	}

	//发给M层存储到fastdfs中
	bufer := make([]byte,hd.Size)
	filedata.Read(bufer)
	path := models.UploadFile(bufer,hd.Filename)

	//更新user中的数据,先取出数据,更新mov_image在插入
	movie := models.Movie{MovId:int64(id),MovImg:path}
	_,err2 := models.UpdateByTablenameAndField(models.MOVIE,"mov_img",&movie)
	if err2 != nil {
		c.PackRecode(c.resp,models.RECODE_DBERR)
		return
	}

	//添加URL信息
	c.resp["mov_img"] = path
	c.PackRecode(c.resp,models.RECODE_OK)

	return
}


func (c *MovieController)DeleteMovie() {

	logs.Debug("删除电影")
	c.resp = make(map[string]interface{})
	defer c.sendJSON(c.resp)

	//检查权限
	if ok := c.JudgeAuthority(models.MG_MOV); !ok {
		return
	}

	data := models.Movie{}

	id,err := c.GetInt64("mov_id")
	if err != nil {
		c.PackRecode(c.resp,models.RECODE_NODATA) //4002 没有收到ID
		return
	}

	logs.Debug("要删除的电影的ID",id)
	data.MovId= id
	err2 := models.DeleteByTablename(models.MOVIE,&data)
	if err2 != nil {
		c.PackRecode(c.resp,models.RECODE_DBERR) //4001 数据库出错
		return
	}

	c.PackRecode(c.resp,models.RECODE_OK)
}

func (c *MovieController) GetMovie() {
	c.resp = make(map[string]interface{})
	defer c.sendJSON(c.resp)

	//验证权限
	if ok := c.JudgeAuthority(models.MG_MOV); !ok {
		return
	}

	pageStr := c.Ctx.Input.Param(":page")
	page,_ := strconv.Atoi(pageStr)
	logs.Debug("获取电影信息第",page,"页")

	slice := []models.Movie{}
	//返回情况返回相应数据
	//models.T()
	err,sum,ret2 := models.GetDataByNumAndOffset(models.MOVIE,&slice,10,(page-1)*10,"mov_id")
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
}


func (c *MovieController)UpdateMovie() {

	logs.Debug("更新电影信息")
	c.resp = make(map[string]interface{})
	defer c.sendJSON(c.resp)

	if ok := c.JudgeAuthority(models.MG_MOV); !ok {
		return
	}


	data := models.Movie{}
	json.Unmarshal(c.Ctx.Input.RequestBody,&data)
	logs.Debug("从前段获取的数据是",data)

	//修改
	err := models.UpdateByTablename(models.MOVIE,&data)

	//返回结果
	if err != nil {
		c.PackRecode(c.resp,models.RECODE_DBERR) //4001　插入失败
		return
	}
	c.PackRecode(c.resp,models.RECODE_OK)


}