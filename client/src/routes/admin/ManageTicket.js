import React, { useState, useEffect, useReducer } from "react";

import {
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageContentHeaderSection,
  EuiPageHeader,
  EuiPageHeaderSection,
  EuiTitle,
  EuiFlexGroup,
  EuiPanel,
  EuiFlexItem,
  EuiStat,
  EuiIcon,
  EuiSpacer,
  EuiForm,
  EuiButton,
  EuiCode,
} from "@elastic/eui";
import { NavBar } from "../../components/navbar/navbar";
import { TicketsTable } from "../../components/table/TicketsTable";
import { AdminTicketFlyout } from "../../components/flyout/flyout";
import { UserView } from "../../components/form/ManageTicketForm/userView";
import { handleFormSubmit } from "../../components/form/ManageTicketForm/handlers";
import { AdminView } from "../../components/form/ManageTicketForm/adminView";
import { Debug } from "../../components/debug/debug";
import axios from "../../api/api";
import {
  fields,
  workLogFields,
} from "../../components/form/ManageTicketForm/fields";
import { dataFetchReducer } from "../../api/reducers";
import { MyStat } from "./Stats";
import { personFields } from "../../components/form/person/fields";

var _ = require("lodash");

const TicketForm = (
  { technician, setSelectedTicket, selectedTicket },
  ...props
) => {
  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: fields,
    workLogData: null,
    workLogLoading: true,
    assignLog: null,
    assignLogLoading: true,
  });

  const [workRefresh, setWorkRefresh] = useState(false);
  const [assignmentRefresh, setAssignmentRefresh] = useState(false);
  const [dataRefresh, setDataRefresh] = useState(false);

  useEffect(() => {
    const fetchWorkLog = async (selectedTicket) => {
      try {
        const result = await axios.get(
          "/work/ticket/" + selectedTicket.ticket_id
        );
        const userResult = await axios.get("/user/admin");
        let final = [];

        for (let i = 0; i < result.data.length; i++) {
          final.push({
            ...result.data[i],
            ...userResult.data.find(
              (itmInner) => itmInner.lsu_id === result.data[i].lsu_id
            ),
          });
        }
        dispatch({ type: "FETCH_WORK_LOG_SUCCESS", payload: final });
      } catch (error) {
        console.log(error);
      }
    };
    if (selectedTicket != null) {
      fetchWorkLog(selectedTicket);
    }
  }, [workRefresh, selectedTicket]);

  useEffect(() => {
    const fetchAssignLog = async (selectedTicket) => {
      try {
        const result = await axios.get(
          "/assign/ticket/" + selectedTicket.ticket_id
        );

        const userResult = await axios.get("/user/admin");
        const final = userResult.data.filter((o) =>
          result.data.find(({ lsu_id }) => o.lsu_id === lsu_id)
        );

        dispatch({ type: "FETCH_ASSIGN_LOG_SUCCESS", payload: final });
      } catch (error) {
        console.log(error);
      }
    };
    if (selectedTicket != null) {
      fetchAssignLog(selectedTicket);
    }
  }, [assignmentRefresh, selectedTicket]);

  useEffect(() => {
    const fetchData = async (selectedTicket) => {
      String.prototype.toProperCase = function () {
        return this.replace(/\w\S*/g, function (txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      };

      try {
        dispatch({ type: "CLEAR_FORM" });
        const result = await axios.get("/ticket/" + selectedTicket.ticket_id);
        let final = [];
        for (const [key, value] of Object.entries(result.data)) {
          console.log(`${key}: ${value}`);
          final.push({
            name: key,
            value: value,
            error: false,
            error_type: "none",
            label: key.replace("_", " ").toProperCase(),
          });
        }

        const union = _.unionBy(final, fields, "name");
        dispatch({
          type: "FETCH_TICKET_SUCCESS",
          payload: union,
        });
      } catch (error) {
        console.log(error);
      }
    };
    if (selectedTicket != null) {
      fetchData(selectedTicket);
    }
  }, [dataRefresh, selectedTicket]);

  const internalFormSubmit = async (e, data) => {
    /* Get ticket id from state */
    const ticket_id = data.filter(x => x.name === "ticket_id").map(y => y.value)[0];
    /* set 'put' arg to true */
    const response = await handleFormSubmit(e, data, `/ticket/${ticket_id}`, true);
    if (response.status === 201) {
      dispatch({ type: "CLEAR_FORM" });
    }
  };
  return (
    <>
      <EuiForm>
        <EuiTitle size={"s"}>
          <h3>Customer Information</h3>
        </EuiTitle>
        {state.isLoading ? null : (
          <>
            <UserView data={state.data} dispatch={dispatch} />
            <AdminView
              technician={technician}
              assignmentRefresh={assignmentRefresh}
              setAssignmentRefresh={setAssignmentRefresh}
              workRefresh={workRefresh}
              setWorkRefresh={setWorkRefresh}
              selectedTicket={selectedTicket}
              data={state.data}
              dispatch={dispatch}
              workLogData={state.workLogData}
              workLogLoading={state.workLogLoading}
              assignLogData={state.assignLogData}
              assignLogLoading={state.assignLogLoading}
            />
          </>
        )}

        <EuiSpacer />
        <EuiFlexGroup gutterSize="s" alignItems="center">
          <EuiFlexItem grow={false}>
            <EuiButton
              type={"submit"}
              onClick={(e) => internalFormSubmit(e, state.data)}
            >
              Submit
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiForm>
      <Debug data={state.data} />
    </>
  );
};

export const ManageTicket = ({ technician }, ...props) => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [tickets, setTickets] = useState(null);
  const [isTicketsLoading, setIsTicketsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get("ticket");
        setTickets(result.data);
        setIsTicketsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleTicketSelection = (e, id) => {
    setSelectedTicket(id);
  };

  return (
    <>
      <div>
        {isTicketsLoading === true ? null : (
          <EuiFlexGroup>
            <EuiFlexItem>
              <MyStat
                data={tickets}
                color={"danger"}
                icon={"node"}
                description={"Open Tickets"}
                filter={"OPEN"}
                isLoading={isTicketsLoading}
              />
            </EuiFlexItem>
            <EuiFlexItem>
              <MyStat
                data={tickets}
                color={"primary"}
                icon={"boxesHorizontal"}
                description={"In Progress"}
                filter={"IN PROGRESS"}
                isLoading={isTicketsLoading}
              />
            </EuiFlexItem>
            <EuiFlexItem>
              <MyStat
                data={tickets}
                color={"secondary"}
                icon={"check"}
                description={"Closed Tickets"}
                filter={"CLOSE"}
                isLoading={isTicketsLoading}
              />
            </EuiFlexItem>
          </EuiFlexGroup>
        )}
      </div>
      <EuiSpacer size={"l"} />
      <EuiTitle size={"s"}>
        <h1>All Tickets</h1>
      </EuiTitle>
      <EuiPanel>
        <TicketsTable
          handleTicketSelection={handleTicketSelection}
          tickets={tickets}
          isLoading={isTicketsLoading}
        />
      </EuiPanel>
      <EuiSpacer size={"l"} />
      <EuiTitle size={"s"}>
        <h1>
          {selectedTicket === null
            ? "Create New Ticket"
            : "Edit " + selectedTicket.first_name + "'s Ticket"}
        </h1>
      </EuiTitle>
      <EuiPanel>
        {selectedTicket == null ? (
          "Please select ticket."
        ) : (
          <TicketForm
            technician={technician}
            selectedTicket={selectedTicket}
            setSelectedTicket={setSelectedTicket}
          />
        )}
      </EuiPanel>
    </>
  );
};
