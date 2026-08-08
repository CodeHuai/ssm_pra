package com.huai.ssm.mapper;

import com.huai.ssm.bean.FurnBean;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface FurnMapper {
    void save(FurnBean furnBean);

    List<FurnBean> findAllFurns();

    int updateFurn(FurnBean furnBean);

    FurnBean getDetailById(int id);

    void removeDataById(int id);
}
