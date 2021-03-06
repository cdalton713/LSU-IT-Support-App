import {
  EuiButton,
  EuiCode,
  EuiFlexGrid,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiSpacer,
  EuiTextArea,
  EuiTitle,
} from "@elastic/eui";
import React, { useState } from "react";
import { MyTextField } from "../MyTextField";
import { MySelectField } from "../MySelectField";
import { addToast } from "../../toast";
import { DEBUG } from "../../app/app";
import { errorMessages } from "./fields";
import { handleFormFieldBlur, handleFormFieldChange } from "./handlers";
import { selectOptions } from "../selectOptions";

var _ = require("lodash");

export const UserView = ({ data, dispatch }, ...props) => {
  return (
    <>
      <EuiFlexGroup style={{ maxWidth: 1000 }}>
        <EuiFlexItem>
          <MyTextField
            name={"first_name"}
            data={data}
            handleChange={(e) => handleFormFieldChange(e, data, dispatch)}
            handleBlur={(e) => handleFormFieldBlur(e, data, dispatch)}
          />
        </EuiFlexItem>
        <EuiFlexItem>
          <MyTextField
            name={"last_name"}
            data={data}
            handleChange={(e) => handleFormFieldChange(e, data, dispatch)}
            handleBlur={(e) => handleFormFieldBlur(e, data, dispatch)}
          />
        </EuiFlexItem>
        <EuiFlexItem>
          <MyTextField
            name={"lsu_id"}
            data={data}
            handleChange={(e) => handleFormFieldChange(e, data, dispatch)}
            handleBlur={(e) => handleFormFieldBlur(e, data, dispatch)}
          />
        </EuiFlexItem>
        <EuiFlexItem>
          <MySelectField
            name={"department"}
            data={data}
            selectOptions={selectOptions.find((o) => o.name === "department")}
            handleChange={(e) => handleFormFieldChange(e, data, dispatch)}
            handleBlur={(e) => handleFormFieldBlur(e, data, dispatch)}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiFlexGroup style={{ maxWidth: 1000 }}>
        <EuiFlexItem grow={false} style={{ width: 250 }}>
          <MyTextField
            name={"email"}
            data={data}
            handleChange={(e) => handleFormFieldChange(e, data, dispatch)}
            handleBlur={(e) => handleFormFieldBlur(e, data, dispatch)}
          />
        </EuiFlexItem>
        <EuiFlexItem grow={false} style={{ width: 200 }}>
          <MyTextField
            name={"phone_number"}
            data={data}
            handleChange={(e) => handleFormFieldChange(e, data, dispatch)}
            handleBlur={(e) => handleFormFieldBlur(e, data, dispatch)}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiSpacer />
      <EuiTitle size={"s"}>
        <h3>General Information</h3>
      </EuiTitle>
      <EuiFlexGroup style={{ maxWidth: 1000 }}>
        <EuiFlexItem grow={false} style={{ width: 150 }}>
          <MySelectField
            name={"priority"}
            data={data}
            selectOptions={selectOptions.find((o) => o.name === "priority")}
            handleChange={(e) => handleFormFieldChange(e, data, dispatch)}
            handleBlur={(e) => handleFormFieldBlur(e, data, dispatch)}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiFlexGroup style={{ maxWidth: 1000 }}>
        <EuiFlexItem>
          <MyTextField
            name={"manufacturer"}
            data={data}
            handleChange={(e) => handleFormFieldChange(e, data, dispatch)}
            handleBlur={(e) => handleFormFieldBlur(e, data, dispatch)}
          />
        </EuiFlexItem>
        <EuiFlexItem>
          <MyTextField
            name={"model"}
            data={data}
            handleChange={(e) => handleFormFieldChange(e, data, dispatch)}
            handleBlur={(e) => handleFormFieldBlur(e, data, dispatch)}
          />
        </EuiFlexItem>
        <EuiFlexItem>
          <MyTextField
            name={"operating_system"}
            data={data}
            handleChange={(e) => handleFormFieldChange(e, data, dispatch)}
            handleBlur={(e) => handleFormFieldBlur(e, data, dispatch)}
          />
        </EuiFlexItem>
        <EuiFlexItem>
          <MyTextField
            name={"operating_system_version"}
            data={data}
            handleChange={(e) => handleFormFieldChange(e, data, dispatch)}
            handleBlur={(e) => handleFormFieldBlur(e, data, dispatch)}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiSpacer />
      <EuiTitle size={"s"}>
        <h3>Issue Information</h3>
      </EuiTitle>
      <EuiFlexGrid>
        <EuiFlexItem>
          <MySelectField
            name={"problem_category"}
            data={data}
            handleChange={(e) => handleFormFieldChange(e, data, dispatch)}
            selectOptions={selectOptions.find(
              (o) => o.name === "problem_category"
            )}
            handleBlur={(e) => handleFormFieldBlur(e, data, dispatch)}
          />
        </EuiFlexItem>
      </EuiFlexGrid>
      <EuiFlexGroup style={{ maxWidth: 1000 }}>
        <EuiFlexItem>
          <EuiFormRow
            label={_.find(data, ["name", "description"]).label}
            error={[
              _.find(errorMessages, [
                "error_type",
                _.find(data, ["name", "description"]).error_type,
              ]).error_message,
            ]}
            isInvalid={_.find(data, ["name", "description"]).error}
          >
            <EuiTextArea
              placeholder={"Computer crashes when..."}
              name={_.find(data, ["name", "description"]).name}
              onChange={(e) => handleFormFieldChange(e, data, dispatch)}
              onBlur={(e) => handleFormFieldBlur(e, data, dispatch)}
              value={_.find(data, ["name", "description"]).value}
            />
          </EuiFormRow>
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
};
