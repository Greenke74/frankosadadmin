import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Page from "../components/common/Page";
import PageHeader from "../components/common/PageHeader";
import { Alert, Box, useMediaQuery } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import IsPublished from "../components/common/IsPublished";
import AddButton from "../components/common/AddButton";

import DeleteIcon from "@mui/icons-material/Delete";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

import { getImageSrc } from "../services/storage-service";
import { deleteProject, getProjects } from "../services/portfolio-api-service";
import {
  deleteConfirmAlert,
  deletedSuccessfullyAlert,
} from "../services/alerts-service";

const ITEMS_PER_PAGE = 8;
const ROW_HEIGHT = 82;

const ProjectsList = () => {
  const isDesktop = useMediaQuery("(min-width:900px)");
  const isMedium = useMediaQuery("(min-width:600px)");
  const isLarge = useMediaQuery("(min-width:1200px)");
  const navigate = useNavigate();

  const [data, setData] = useState([]);

  useEffect(() => {
    let mounted = true;
    getProjects().then((response) => {
      mounted && setData(response);
    });
    return () => (mounted = false);
  }, []);

  const handleDelete = (id) => {
    deleteConfirmAlert("проєкт").then(async (result) => {
      if (result.value) {
        await deleteProject(id);
        deletedSuccessfullyAlert("Проєкт");
        const projects = await getProjects();
        setData(projects);
      }
    });
  };

  const columns = [
    {
      field: "id",
      hideable: true,
    },
    {
      field: "image",
      flex: 1,
      sortable: false,
      renderCell: ({ row }) =>
        isMedium ? (
          <div
            style={{
              display: "flex",
              flexWrap: "nowrap",
              alignItems: "center",
            }}
          >
            <img
              style={{
                objectFit: "contain",
                maxWidth: "150px",
                maxHeight: "100%",
                borderRadius: 4,
                marginRight: 10,
              }}
              src={getImageSrc(row.image)}
            />
            <p style={{ whiteSpace: "normal", margin: 0, fontWeight: 500 }}>
              {row.title}
            </p>
          </div>
        ) : (
          <p style={{ whiteSpace: "normal", margin: 0, fontWeight: 500 }}>
            {row.title}
          </p>
        ),
      headerName: "Зданий проєкт",
    },
    {
      hideable: true,
      field: "completed_at",
      width: 140,
      flex: 0.3,
      sortable: false,
      headerName: "Дата здачі",
      type: "date",
      renderCell: ({ row }) => (
        <span>{new Date(row.completed_at).toLocaleDateString("uk-UA")}</span>
      ),
    },
    {
      hideable: true,
      field: "is_published",
      sortable: false,
      width: 120,
      headerName: "Опубліковано",
      renderCell: ({ row }) => (
        <div style={{ margin: "auto" }}>
          <IsPublished isPublished={row.is_published} colored />
        </div>
      ),
    },
    {
      hideable: true,
      field: "location",
      flex: 0.4,
      sortable: false,
      headerName: "Локація",
    },
    {
      headerName: "Дії",
      field: "actions",
      type: "actions",
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditRoundedIcon color="success" />}
          onClick={() => {
            navigate(`/projects/${params.row.id}`);
          }}
          label="Print"
          title={"Редагувати об'єкт"}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon color="error" />}
          label="Delete"
          title={"Видалити об'єкт"}
          onClick={() => {
            handleDelete(params.row.id);
          }}
        />,
      ],
    },
  ];

  return (
    <>
      <PageHeader title={"Список проєктів"} />
      <Page>
        <Box padding={2}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              border: "1px solid #e0e0e0",
              borderRadius: 1,
              marginBottom: 2,
              padding: 1,
            }}
          >
            <AddButton
              label="Додати проєкт"
              onClick={() => navigate("/projects/new")}
            />
            {isDesktop && (
              <Alert
                sx={{ height: "36.5px", overflow: "hidden", padding: "0 10px" }}
                severity="info"
              >
                Ви можете додати нові проєкти
              </Alert>
            )}
          </Box>
          <Box height={`calc((${ITEMS_PER_PAGE} * ${ROW_HEIGHT}px) + 111px)`}>
            <DataGrid
              rows={data}
              columns={columns}
              disableColumnFilter
              disableColumnMenu
              rowHeight={ROW_HEIGHT}
              pageSize={ITEMS_PER_PAGE}
              disableSelectionOnClick={true}
              columnVisibilityModel={{
                id: false,
                location: isLarge,
                is_published: isMedium,
                completed_at: isDesktop,
              }}
              sortModel={[{ field: "id", sort: "desc" }]}
              sx={{
                "div:last-child > div": {
                  borderBottom: "none !important",
                },
              }}
            ></DataGrid>
          </Box>
        </Box>
      </Page>
    </>
  );
};

export default ProjectsList;
