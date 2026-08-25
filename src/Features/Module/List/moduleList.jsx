import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../Component/BaseComponent/axiosInstance";
import CustomNavbar from "../../../Component/Layout/CustomNavbar";
import TopBar from "../../../Component/Common/TopBar";
import Button from "../../../Component/Common/Button";
import { DeleteIcon, EditIcon, PreviewIcon } from "../../../Icon/Icon";
import toast from "react-hot-toast";
import { renderRecordValue } from "./renderRecordValue";
import Pagination from "./Pagination";
import AssignTo from "../../../Component/Common/AssignTo";
import InlineDropdown from "../../../Component/Common/InlineDropdown";
import CellTooltip from "../../../Component/Common/CellTooltip";

const ModuleList = () => {
    const { moduleKey, moduleId } = useParams();
    const navigate = useNavigate();
    const [moduleFieldData, setmoduleFieldData] = useState([]);
    const [modileFieldRecordValues, setmodileFieldRecordValues] = useState([]);
    const [search, setSearch] = useState("");
    const [pageNumber, setPageNumber] = useState(0);
    const [pageSize, setPageSize] = useState(25);
    const [canCreateAccess, setCanCreateAccess] = useState(true);
    const [canEditAccess, setCanEditAccess] = useState(true);
    const [canDeleteAccess, setCanDeleteAccess] = useState(true);
    const [moduleName, setModuleName] = useState(moduleKey === "null" || !moduleKey ? "" : moduleKey);
    const [dropdownOptions, setDropdownOptions] = useState({});
    const [employeeIds, setEmployeeIds] = useState([]);
    const [paginationData, setPaginationData] = useState({
        totalElements: 0,
        totalPages: 0,
        numberOfElements: 0,
        first: true,
        last: true
    });

    const containerRef = useRef(null);
    const tableRef = useRef(null);
    const [tableOverflows, setTableOverflows] = useState(false);
    const naturalWidthRef = useRef(0);

    useEffect(() => {
        if (!moduleId) return;

        let currentSearch = search;
        let currentPageNumber = pageNumber;

        const isWaitingForAccess = checkModuleAccess(moduleId);

        if (isWaitingForAccess) {
            return; // Wait for checkModuleAccess to update the state before fetching
        }

        if (prevModuleIdRef.current !== moduleId) {
            prevModuleIdRef.current = moduleId;
            setmoduleFieldData([]);
            setmodileFieldRecordValues([]);
            setPageNumber(0);
            setSearch("");
            fetchModuleFieldData(moduleId);
            fetchModuleName(moduleId);
            currentSearch = "";
            currentPageNumber = 0;
        }

        const hasParamsChanged =
            lastFetchedRef.current.moduleId !== moduleId ||
            lastFetchedRef.current.search !== currentSearch ||
            lastFetchedRef.current.pageNumber !== currentPageNumber ||
            lastFetchedRef.current.pageSize !== pageSize ||
            JSON.stringify(lastFetchedRef.current.employeeIds) !== JSON.stringify(employeeIds);

        if (hasParamsChanged) {
            lastFetchedRef.current = { moduleId, search: currentSearch, pageNumber: currentPageNumber, pageSize, employeeIds };
            fetchModuleFieldRecordValues(moduleId, currentSearch, currentPageNumber, pageSize);
        }

        if (moduleFieldData.length > 0 && lastFetchedFieldsRef.current !== moduleFieldData) {
            lastFetchedFieldsRef.current = moduleFieldData;
            fetchAllDropdownOptions();
        }
    }, [moduleId, pageNumber, pageSize, search, moduleFieldData, employeeIds]);

    useEffect(() => {
        setTableOverflows(false);
        naturalWidthRef.current = 0;
    }, [modileFieldRecordValues, moduleFieldData]);

    useEffect(() => {
        checkOverflow();

        let resizeObserver;
        if (containerRef.current && window.ResizeObserver) {
            resizeObserver = new ResizeObserver(() => {
                checkOverflow();
            });
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            if (resizeObserver) {
                resizeObserver.disconnect();
            }
        };
    }, [tableOverflows, modileFieldRecordValues, moduleFieldData]);

    const sortedFields = [...moduleFieldData].sort(
        (a, b) => a.displayOrder - b.displayOrder
    );

    const displayFields = sortedFields.filter(f => f.fieldKey !== 'assignTo');
    const hasAssignTo = sortedFields.some(f => f.fieldKey === 'assignTo');
    const assignToField = sortedFields.find(f => f.fieldKey === 'assignTo');

    const prevModuleIdRef = useRef(null);
    const lastFetchedRef = useRef({ moduleId: null, search: null, pageNumber: null, pageSize: null });
    const lastFetchedFieldsRef = useRef([]);



    const fetchAllDropdownOptions = async () => {
        const optionsMap = {};
        const dropdownFields = moduleFieldData.filter(
            f => (f.fieldType === 'DROPDOWN' || f.relatedTo || f.releatedTo) && f.fieldKey !== 'assignTo'
        );

        await Promise.all(dropdownFields.map(async (field) => {
            try {
                if (field.relatedTo || field.releatedTo) {
                    const response = await axiosInstance.get(
                        `/recordFieldValue/getRecordIdAndValue?moduleId=${field.relatedToModuleId}&fieldId=${field.relatedToModuleFieldId}`
                    );
                    optionsMap[field.id] = (response.data || []).map(opt => ({
                        value: opt.recordId,
                        label: opt.value || "(Empty)"
                    }));
                } else {
                    const response = await axiosInstance.get(`/multiFieldValue/getByFieldId/${field.id}`);
                    optionsMap[field.id] = response.data || [];
                }
            } catch (error) {
                console.error(`Error fetching options for field ${field.id}:`, error);
            }
        }));

        setDropdownOptions(optionsMap);
    };

    const checkOverflow = () => {
        const container = containerRef.current;
        const table = tableRef.current;
        if (!container || !table) return;

        const containerWidth = container.clientWidth;

        if (!tableOverflows) {
            const currentScrollWidth = table.scrollWidth;
            if (currentScrollWidth > containerWidth) {
                naturalWidthRef.current = currentScrollWidth;
                setTableOverflows(true);
            }
        } else {
            if (containerWidth >= naturalWidthRef.current) {
                setTableOverflows(false);
                naturalWidthRef.current = 0;
            }
        }
    };

    const handleDropdownUpdate = async (recordId, field, newValue) => {
        try {
            const payload = {
                recordId: recordId,
                moduleId: moduleId,
                moduleFieldKey: field.fieldKey,
                newValue: newValue
            };

            await axiosInstance.put("/recordFieldValue/updateSingleRecordValue", payload);
            toast.success("Record updated successfully!");

            fetchModuleFieldRecordValues(moduleId, search, pageNumber, pageSize);
        } catch (error) {
            console.error("Error updating field:", error);
            toast.error(error.response?.data?.message || "Failed to update record.");
        }
    };

    const fetchModuleName = async (mId) => {
        try {
            const response = await axiosInstance.get('/module/getAllModule');
            const found = (response.data || []).find(m => String(m.id) === String(mId));
            if (found) {
                setModuleName(found.name || found.moduleKey || moduleKey);
            }
        } catch (e) {
            console.error("Error fetching module name:", e);
        }
    };

    const fetchModuleFieldData = async (moduleId) => {
        try {
            const response = await axiosInstance.get(`/field/getByModuleId/${moduleId}`)
            const visibleFields = (response.data || []).filter(field => field.visibleInList === true);
            setmoduleFieldData(visibleFields);
        }
        catch (error) {
            console.log(error);
        }
    }

    const checkModuleAccess = (moduleId) => {
        const moduleAccessData = localStorage.getItem('moduleAccess');
        const role = localStorage.getItem('role');
        const moduleAccessList = moduleAccessData ? JSON.parse(moduleAccessData) : [];
        const userId = localStorage.getItem('userId');
        
        if (role === "ROLE_EMPLOYEE") {
            const moduleAccess = moduleAccessList.find(
                (item) => String(item.moduleId) === String(moduleId)
            );

            if (moduleAccess) {
                setCanCreateAccess(moduleAccess.canCreate);
                setCanEditAccess(moduleAccess.canEdit);
                setCanDeleteAccess(moduleAccess.canDelete);
                
                const targetEmployeeIds = moduleAccess.canViewAll ? [] : [userId];
                
                if (JSON.stringify(employeeIds) !== JSON.stringify(targetEmployeeIds)) {
                    setEmployeeIds(targetEmployeeIds);
                    return true; // indicates state is updating, wait for re-render
                }
            }
        } else {
            // For admins, ensure employeeIds is empty
            if (employeeIds.length !== 0) {
                setEmployeeIds([]);
                return true;
            }
        }
        
        return false; // ready to fetch
    }

    const fetchModuleFieldRecordValues = async (moduleId, query, pageNum = pageNumber, sizeNum = pageSize) => {
        try {
            const response = await axiosInstance.put(
                "/recordFieldValue/getAllDataByModuleId",
                { employeeIds: employeeIds },
                {
                    params: {
                        moduleId: moduleId,
                        sort: "createdDate,desc",
                        page: pageNum,
                        size: sizeNum,
                        query: query
                    },
                }
            );

            setmodileFieldRecordValues(response.data.body.content || []);
            setPaginationData({
                totalElements: response.data.body.totalElements || 0,
                totalPages: response.data.body.totalPages || 0,
                numberOfElements: response.data.body.numberOfElements || 0,
                first: response.data.body.first,
                last: response.data.body.last
            });
        } catch (error) {
            console.error(error);
        }
    };

    const openCreatePage = (moduleId) => {
        navigate(`/${moduleKey}/${moduleId}/create`);
    }

    const handleSearch = (value) => {
        setSearch(value);
        setPageNumber(0);
    };

    const openEditPage = (recordId) => {
        navigate(`/${moduleKey}/${moduleId}/${recordId}/edit`);
    }

    const openPreviewPage = (recordId) => {
        navigate(`/${moduleKey}/${moduleId}/${recordId}/preview`);
    }

    const deleteModuleFieldValue = async (recordId) => {
        try {
            await axiosInstance.delete(`/recordFieldValue/deleteByRecordId/${recordId}`);
            toast.success("Record deleted successfully!");
            fetchModuleFieldRecordValues(moduleId, search, pageNumber, pageSize);
        }
        catch (error) {
            console.error("Error deleting record:", error);
            toast.error(error.response?.data?.message || "Failed to delete record.");
        }
    }

    return (
        <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
            <CustomNavbar />
            <div className="flex-1 w-full mx-auto flex flex-col overflow-hidden">
                <div className="px-4 sm:px-6 lg:px-0 ">
                    <TopBar
                        title={moduleName}
                        buttonText="Create"
                        onButtonClick={() => openCreatePage(moduleId)}
                        showSearch={true}
                        onSearchChange={handleSearch}
                        showButton={canCreateAccess}
                    />
                </div>

                <div ref={containerRef} className="flex-1 bg-white rounded-xl border-2 border-gray-200 shadow-xs flex flex-col overflow-x-auto overflow-y-hidden">
                    <div className="flex-1 overflow-y-auto">
                        <table ref={tableRef} className="min-w-max w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    {displayFields.length > 0 || hasAssignTo ? (
                                        <>  {displayFields.map((field) => {
                                            const headerText = field.fieldName || "";
                                            const isHeaderLong = tableOverflows && headerText.length > 30;
                                            const displayHeader = isHeaderLong ? headerText.substring(0, 30) + "..." : headerText;

                                            return (
                                                <th
                                                    key={field.id}
                                                    scope="col"
                                                    className={`sticky top-0 z-20 bg-gray-50 px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider ${tableOverflows ? "w-[200px] max-w-[200px] min-w-[200px]" : ""
                                                        }`}
                                                >
                                                    <CellTooltip text={headerText} forceShow={isHeaderLong}>
                                                        <span>{displayHeader}</span>
                                                    </CellTooltip>
                                                </th>
                                            );
                                        })}

                                            {hasAssignTo && (
                                                <th
                                                    scope="col"
                                                    className="sticky top-0 right-24 z-30 bg-gray-50 px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-0"
                                                >
                                                    Assign To
                                                </th>
                                            )}

                                            <th
                                                scope="col"
                                                className="sticky top-0 right-0 z-30 bg-gray-50 px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-0"
                                            >
                                                Action
                                            </th>
                                        </>
                                    ) : (
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-20 bg-gray-50 px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                        >
                                            No fields configured for this module.
                                        </th>
                                    )}
                                </tr>
                            </thead>

                            <tbody className="bg-white">
                                {modileFieldRecordValues.length > 0 ? (
                                    modileFieldRecordValues.map((record) => (
                                        <tr key={record.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors group">
                                            {displayFields.map((field) => {
                                                const fullText = renderRecordValue(record[field.fieldKey], field.fieldType);
                                                const isLong = tableOverflows && fullText.length > 30;
                                                const displayText = isLong ? fullText.substring(0, 30) + "..." : fullText;

                                                return (
                                                    <td
                                                        key={field.id}
                                                        className={`px-6 py-2 whitespace-nowrap text-sm text-gray-900 ${tableOverflows ? "w-[200px] max-w-[200px] min-w-[200px]" : ""
                                                            }`}
                                                    >
                                                        {(field.fieldType === 'DROPDOWN' || field.relatedTo || field.releatedTo) ? (
                                                            <InlineDropdown
                                                                field={field}
                                                                recordId={record.id}
                                                                currentValue={record[field.fieldKey]}
                                                                options={dropdownOptions[field.id] || []}
                                                                onUpdate={handleDropdownUpdate}
                                                                shouldTruncate={tableOverflows}
                                                            />
                                                        ) : (
                                                            <CellTooltip text={fullText} forceShow={isLong}>
                                                                <span>{displayText}</span>
                                                            </CellTooltip>
                                                        )}
                                                    </td>
                                                );
                                            })}

                                            {hasAssignTo && (
                                                <td className="sticky right-24 z-10 bg-white group-hover:bg-gray-50 border-0 px-4 py-1 whitespace-nowrap text-sm text-gray-900 min-w-[150px]">
                                                    <AssignTo
                                                        variant="inline"
                                                        value={record.assignTo}
                                                        onChange={(val) => handleDropdownUpdate(record.id, assignToField, val)}
                                                    />
                                                </td>
                                            )}

                                            <td className="sticky right-0 z-10 bg-white group-hover:bg-gray-50 border-0 px-4 py-2 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        className="p-1.5 flex items-center justify-center rounded-lg bg-transparent hover:bg-emerald-50 text-emerald-500 border border-emerald-200 cursor-pointer w-7 h-7 transition-colors"
                                                        onClick={() => openPreviewPage(record.id)}
                                                        title="Preview Record"
                                                    >
                                                        <PreviewIcon size={14} />
                                                    </button>

                                                    {canEditAccess && (<button
                                                        type="button"
                                                        className="p-1.5 flex items-center justify-center rounded-lg bg-transparent hover:bg-blue-50 text-blue-500 border border-blue-200 cursor-pointer w-7 h-7"
                                                        onClick={() => openEditPage(record.id)}
                                                        title="Edit Record"
                                                    >
                                                        <EditIcon size={14} />
                                                    </button>)}

                                                    {canDeleteAccess && <button
                                                        type="button"
                                                        className="p-1.5 flex items-center justify-center rounded-lg bg-transparent hover:bg-red-50 text-red-500 border border-red-200 cursor-pointer w-7 h-7"
                                                        onClick={() => deleteModuleFieldValue(record.id)}
                                                        title="Delete Record"
                                                    >
                                                        <DeleteIcon size={14} />
                                                    </button>}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={displayFields.length + (hasAssignTo ? 1 : 0) + 1}
                                            className="px-6 py-10 text-center"
                                        >
                                            No Records Found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        pageNumber={pageNumber}
                        pageSize={pageSize}
                        totalElements={paginationData.totalElements}
                        totalPages={paginationData.totalPages}
                        first={paginationData.first}
                        last={paginationData.last}
                        onPageChange={setPageNumber}
                        onPageSizeChange={(newSize) => {
                            setPageSize(newSize);
                            setPageNumber(0);
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default ModuleList;
