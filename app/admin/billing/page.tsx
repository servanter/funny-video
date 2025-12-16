'use client'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Billing } from "@prisma/client";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export default function BillingPage() {

    const [billingList, setBillingList] = useState<Billing[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchBillingList();
    }, [])

    const fetchBillingList = async (page = 1) => {
        const response = await fetch(`/api/admin/billing?page=${page}&pageSize=8`);
        if (response.ok) {
            const data = await response.json();

            setBillingList(data.data.billingList);
            setCurrentPage(page);
            setTotalPages(Math.ceil(data.data.total / 8));
            console.log('Fetched data:', data);
            console.log('total Page:', Math.ceil(data.data.total / 2));
        } else {
            console.error('Failed to fetch data:', response.statusText);
        }
    }

    // 分页算法：生成要显示的分页按钮
    const generatePaginationItems = () => {
        const items = [];
        const showEllipsis = totalPages > 5;

        // 总是显示第一页
        items.push(1);

        // 如果总页数大于5，需要智能显示
        if (showEllipsis) {
            // 当前页在开头部分（前3页）
            if (currentPage <= 3) {
                items.push(2, 3, 4);
                if (totalPages > 5) items.push('ellipsis');
            }
            // 当前页在中间部分
            else if (currentPage > 3 && currentPage < totalPages - 2) {
                items.push('ellipsis');
                items.push(currentPage - 1, currentPage, currentPage + 1);
                items.push('ellipsis');
            }
            // 当前页在结尾部分（最后3页）
            else {
                items.push('ellipsis');
                items.push(totalPages - 3, totalPages - 2, totalPages - 1);
            }
        } else {
            // 总页数小于等于5，显示所有页码
            for (let i = 2; i <= totalPages; i++) {
                items.push(i);
            }
        }

        // 总是显示最后一页（如果总页数大于1）
        if (totalPages > 1 && !items.includes(totalPages)) {
            items.push(totalPages);
        }

        return items;
    };

    const paginationItems = generatePaginationItems();

    return (
        <div className="h-full">
            <Table className="border">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[400px] border">Order Id</TableHead>
                        <TableHead className="border"> Create Time</TableHead >
                        <TableHead className="border">IP</TableHead>
                        <TableHead className="text-right border">Amount</TableHead>
                    </TableRow >
                </TableHeader >
                <TableBody >
                    {billingList.map((billing) => (
                        <TableRow key={billing.id}>
                            <TableCell className="font-medium border">{billing.order_id}</TableCell>
                            <TableCell className="border">{dayjs(billing.create_time).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
                            <TableCell className="border">{billing.ip_address}</TableCell>
                            <TableCell className="text-right border">${billing.amount}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>

            </Table >
            <Pagination className="mt-5">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={() => currentPage > 1 && fetchBillingList(currentPage - 1)}
                            className="hover:bg-purple-600 hover:text-white transition-colors duration-200"
                        />
                    </PaginationItem>

                    {paginationItems.map((item, index) => (
                        <PaginationItem key={index}>
                            {item === 'ellipsis' ? (
                                <PaginationEllipsis />
                            ) : (
                                <PaginationLink
                                    href="#"
                                    isActive={item === currentPage}
                                    onClick={() => item === currentPage ? null : fetchBillingList(item as number)}
                                    className="hover:bg-purple-600 hover:text-white transition-colors duration-200"
                                >
                                    {item}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={() => currentPage < totalPages && fetchBillingList(currentPage + 1)}
                            className="hover:bg-purple-600 hover:text-white transition-colors duration-200"
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>

        </div >
    )
}
