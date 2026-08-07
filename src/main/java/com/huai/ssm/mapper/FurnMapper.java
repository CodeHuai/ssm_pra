package com.huai.ssm.mapper;

import com.huai.ssm.bean.FurnBean;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface FurnMapper {
    void save(FurnBean furnBean);
}
