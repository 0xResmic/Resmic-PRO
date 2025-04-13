const { getRecentTransactionsService, getUserStatService, getUniqueAddressDetailsService, editTransactionService, getTransactionByAddressORHashService, getGraphTxsService } = require("../services/dashboardServices");

const handleResponse = (res, status, success, message, data = null) => {
    res.status(status).json({
        status,
        success,
        message,
        data,
    })
}

const getRecentTransactions = async (req, res, next) => {
    // const user_id = req.user.user_id;
    let {
        user_id,
        from_wallet_address, transaction_hash,
        page,
        limit,
        sort_by = "created_at",
        order = "DESC",
        blockchain,
        token,
        from_date,
        to_date,
        status
      } = req.query;
      console.log("sdfasdf", page)

      if (!user_id) {
        return res.status(400).json({ error: "user_id is required" });
      }
    try {
        
        const {total_count, data} = await getRecentTransactionsService(user_id,
            from_wallet_address, 
            transaction_hash,
            page,
            limit,
            sort_by,
            order,
            blockchain,
            token,
            from_date,
            to_date,
            status);
            res.status(200).json({
                success:true,
                message:"Transaction retrieved successfully",
                total_count:total_count,
                data:data,
            })
        // handleResponse(res, 200, true, "Transactions retrieved successfully", getTxs);
    } catch (error) {
        next(error);
    }
}

const getUserStats = async(req, res, next) => {
    try {
        const { user_id, from_date, to_date } = req.query;
        if (!user_id) {
        return res.status(400).json({ error: "user_id is required" });
        }

        const result = await getUserStatService(user_id, from_date, to_date);
        handleResponse(res, 200, true, "User Stats retrieved successfully", result);
    } catch (error) {
        next(error);
    }
}

const getUniqueAddressDetails = async(req, res, next) => {
    try {
        const { user_id, page, limit, from_wallet_address} = req.query;
        if (!user_id) {
            handleResponse(res, 400, false, "user_id is required", "");
        }

        const {page_count, data} = await getUniqueAddressDetailsService(user_id, page, limit, from_wallet_address);
        let status = 200
        res.status(status).json({
            status,
            success: true,
            message:"User address details retrieved successfully",
            page_count,
            data,
        })
        // handleResponse(res, 200, true, "User address details retrieved successfully", result);
    } catch (error) {
        console.log("error", error);
        next(error);
    }
}
const editUserTransaction = async(req, res, next) => {
    try {
        const { session_id, status} = req.body;

        const result = await editTransactionService(session_id, status);
        handleResponse(res, 200, true, "Transaction updated successfully", result);
    } catch (error) {
        next(error);
    }
}
const getTransactionByAddressORHash = async(req, res, next) => {
    try {
        let { from_wallet_address='', transaction_hash='', page, limit } = req.query;

        const {data, total_count} = await getTransactionByAddressORHashService(from_wallet_address, transaction_hash, page, limit);
        // handleResponse(res, 200, true, "User Stats retrieved successfully", result);
        res.status(200).json({
            success:true,
            message:"Transaction retrieved successfully",
            total_count:total_count,
            data:data,
        })
    } catch (error) {
        next(error);
    }
}
const getGraphStats = async(req, res, next) => {
    try {
        let { user_id} = req.query;
        console.log("user_id", user_id);

        const result = await getGraphTxsService(user_id);
        // handleResponse(res, 200, true, "User Stats retrieved successfully", result);
        res.status(200).json({
            success:true,
            message:"Transaction stats retrieved successfully",
            data:result,
        })
    } catch (error) {
        console.log("Error", error);
        next(error);
    }
}
// const getUserStatsss = async(req, res, next) => {
//     try {
//         const { } = req.query;

//         const result = await getUserStatService();
//         handleResponse(res, 200, true, "User Stats retrieved successfully", getTxs);
//     } catch (error) {
//         next(error);
//     }
// }
module.exports = { getRecentTransactions, getUserStats, getUniqueAddressDetails, editUserTransaction, getTransactionByAddressORHash, getGraphStats };