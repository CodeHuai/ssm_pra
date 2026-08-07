package com.huai.ssm.mapper;

import com.huai.ssm.bean.FurnBean;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface FurnMapper {
    void save(FurnBean furnBean);

    List<FurnBean> findAllFurns();

    FurnBean updateFurn(FurnBean furnBean);
}
