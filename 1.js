import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Checkbox } from "sugar-design";
import { RadioGroup } from "moka-ui";

import MultiTalentPoolSelect from "../select/MultiTalentPoolSelect";

import { getI18n } from "../../../../common/i18n";

import styles from "./DataRangeSelect.cm.styl";
import * as sdf from "@SDFoundation";

const i18n = getI18n();

const RADIO_TYPE = {
  ALL: "all",
  CUSTOM: "0",
};

const OPTIONS = [
  { label: i18n.t`全部人才库`, value: RADIO_TYPE.ALL },
  { label: i18n.t`自定义人才库`, value: RADIO_TYPE.CUSTOM },
];

const CHECKBOX_TYPE = {
  ASSIGNING: "assigning",
  PROCESSING: "processing",
  TALENT: "talent",
};

function useDataRangeSelect() {
  const [data, setUseDataRange] = useState({
    assigning: false, // 待分配人才
    processing: false, //流程中人才
    talent: false, // 人才库人才
    talentPools: [], // 选择的人才库
    radioGroupValue: null, // 全部人才库，自定义人才库
  });
  const onTalentPoolsInputChange = (talentPools) => {
    data = { ...data, talentPools };
    setUseDataRange(data);
  };
  const onRadioGroupChange = (radioGroupValue) => {
    if (data.radioGroupValue) {
      setUseDataRange({ ...data, radioGroupValue: null, talentPools: [] });
    } else {
      let talentPools = [];
      if (isNaN(radioGroupValue)) {
        talentPools.push(RADIO_TYPE.ALL);
      }
      setUseDataRange({ ...data, radioGroupValue, talentPools });
    }
  };
  const onCheckboxChange = (checkboxType, checked) => {
    setUseDataRange({ ...data, [checkboxType]: checked });
    // this.setState({ [checkboxType]: checked }, this.onDataRangeCallback);
  };
  useEffect(() => {
    return () => {
      this.props.onDataRangeCallback({
        assigning: data.assigning,
        processing: data.processing,
        talentPools: data.talentPools,
      });
    };
  });

  return {
    data,
    onTalentPoolsInputChange,
    onRadioGroupChange,
    onCheckboxChange,
  };
}

/**
 * 人才地图V2版本step3选择数据范围
 */
export function SelectTalentPool(props) {
  const { talentPoolEntities, error } = props;
  const {
    onTalentPoolsInputChange,
    onRadioGroupChange,
    onCheckboxChange,
    data: { talent, radioGroupValue, assigning, processing },
  } = useDataRangeSelect();
  return (
    <ul>
      <li className={styles.list}>
        <Checkbox
          onChange={(e) =>
            onCheckboxChange(CHECKBOX_TYPE.ASSIGNING, e.target.checked)
          }
          checked={assigning}
        />
        <span className={styles.label}>{i18n.t`待分配人才`}</span>
      </li>
      <li className={styles.list}>
        <Checkbox
          onChange={(e) =>
            onCheckboxChange(CHECKBOX_TYPE.PROCESSING, e.target.checked)
          }
          checked={processing}
        />
        <span className={styles.label}>{i18n.t`流程中人才`}</span>
      </li>
      <li className={styles.list}>
        <Checkbox
          onChange={(e) =>
            onCheckboxChange(CHECKBOX_TYPE.TALENT, e.target.checked)
          }
          checked={talent}
        />
        <span className={styles.label}>{i18n.t`人才库人才`}</span>
        {talent && (
          <RadioGroup
            className={styles.radioGroup}
            options={OPTIONS}
            onChange={onRadioGroupChange}
            value={radioGroupValue}
          />
        )}
        {talent && radioGroupValue === RADIO_TYPE.CUSTOM && (
          <MultiTalentPoolSelect
            className={styles.multiTalentPool}
            talentPoolEntities={talentPoolEntities}
            multiTalentPoolIds={talentPools}
            onChange={(value) => onTalentPoolsInputChange(value)}
            error={error}
          />
        )}
      </li>
    </ul>
  );
}

/**
 * 人才地图V2版本step2选择数据范围
 */
export function StepTwoSelectTalentPool(props) {
  const { talentPoolEntities, error } = props;
  const {
    onTalentPoolsInputChange,
    onRadioGroupChange,
    onCheckboxChange,
    data: { talent, radioGroupValue, assigning, processing },
  } = useDataRangeSelect();
  return (
    <ul>
      <li
        className={classNames(styles.flexWrapper, styles.listWrapper, {
          [styles.listWrapperActive]: assigning,
        })}
      >
        <div>
          <div className={classNames(sdf.heading60, styles.title)}>
            {" "}
            {i18n.t`待分配人才`}
          </div>
          <div className={sdf.caption}>
            {" "}
            {i18n.t`系统中暂未匹配职位，处于待分配阶段的候选人`}
          </div>
        </div>
        <Checkbox
          onChange={(e) =>
            onCheckboxChange(CHECKBOX_TYPE.ASSIGNING, e.target.checked)
          }
          checked={assigning}
        />
      </li>
      <li
        className={classNames(styles.flexWrapper, styles.listWrapper, {
          [styles.listWrapperActive]: processing,
        })}
      >
        <div>
          <div className={classNames(sdf.heading60, styles.title)}>
            {" "}
            {i18n.t`流程中人才`}
          </div>
          <div className={sdf.caption}>
            {" "}
            {i18n.t`候选人管理处于招聘流程中的候选人`}
          </div>
        </div>
        <Checkbox
          onChange={(e) =>
            onCheckboxChange(CHECKBOX_TYPE.PROCESSING, e.target.checked)
          }
          checked={processing}
        />
      </li>
      <li
        className={classNames(styles.listWrapper, {
          [styles.listWrapperActive]: talent,
        })}
      >
        <div className={styles.flexWrapper}>
          <div>
            <div className={classNames(sdf.heading60, styles.title)}>
              {" "}
              {i18n.t`人才库人才`}
            </div>
            <div className={sdf.caption}> {i18n.t`储备在人才库中的候选人`}</div>
          </div>
          <Checkbox
            onChange={(e) =>
              onCheckboxChange(CHECKBOX_TYPE.TALENT, e.target.checked)
            }
            checked={talent}
          />
        </div>
        {talent && (
          <RadioGroup
            className={styles.radioGroup}
            options={OPTIONS}
            onChange={onRadioGroupChange}
            value={radioGroupValue}
          />
        )}
        {talent && radioGroupValue === RADIO_TYPE.CUSTOM && (
          <MultiTalentPoolSelect
            className={styles.multiTalentPool}
            talentPoolEntities={talentPoolEntities}
            multiTalentPoolIds={talentPools}
            onChange={(value) => onTalentPoolsInputChange(value)}
            error={error}
          />
        )}
      </li>
    </ul>
  );
}
