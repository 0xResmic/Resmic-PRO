const pool = require('../config/db');


const getRecentTransactionsService = async(user_id, from_wallet_address, transaction_hash, page_=1, limit=10 , sort_by = "created_at", order = "DESC", blockchain, token,from_date,to_date, status) => {

    // Base query
    let query = `SELECT *, COUNT(*) OVER() AS total_count FROM transactions WHERE user_id = $1`;
    let values = [user_id];
    let index = 2;

    // Filters
    if (blockchain) {
      query += ` AND blockchain = $${index++}`;
      values.push(blockchain);
    }
    if (from_wallet_address) {
      query += ` AND from_wallet_address = $${index++}`;
      values.push(from_wallet_address);
    }
    if (transaction_hash) {
      query += ` AND transaction_hash = $${index++}`;
      values.push(transaction_hash);
    }
    if (token) {
      query += ` AND token = $${index++}`;
      values.push(token);
    }
    if (from_date && to_date) {
      query += ` AND created_at BETWEEN $${index++} AND $${index++}`;
      values.push(from_date, to_date);
    }

    // Sorting
    const validSortFields = ["created_at", "amount"];
    if (!validSortFields.includes(sort_by)) {
      return res.status(400).json({ error: "Invalid sort_by field" });
    }

    const validOrder = ["ASC", "DESC"];
    if (!validOrder.includes(order.toUpperCase())) {
      return res.status(400).json({ error: "Invalid order (must be ASC or DESC)" });
    }
    if (status) {
        query += ` AND status = $${index++}`;
        values.push(status);
    }

    query += ` ORDER BY ${sort_by} ${order.toUpperCase()}`;

    // Pagination
    const offset = (page_ - 1) * limit;
    query += ` LIMIT $${index++} OFFSET $${index}`;
    values.push(limit, offset);

    // Execute Query
    const result = await pool.query(query, values);
    const total_count = result.rows[0].total_count;
    if(result?.rows?.length === 0){
        return []
    }
    const data = result.rows
    return {data, total_count}
}

/*
    count of txs
    total volume
    
    Unique users wallet address
    
    today's volume
    today's txs count
    
    This week volume
    This week txs count

    from-date
    to-date
*/
const getUserStatService = async(user_id, from_date, to_date) => {

const query = `WITH filtered_transactions AS (
    SELECT 
        from_wallet_address, 
        transaction_hash, 
        amount, 
        created_at
    FROM transactions
    WHERE (status = 'Completed' OR status = 'completed') 
    AND user_id = $1
),
aggregated AS (
    SELECT 
        COUNT(DISTINCT from_wallet_address) AS unique_users,
        COUNT(transaction_hash) AS total_txs,
        COALESCE(SUM(amount), 0) AS total_volume,

        -- Transactions and volume in the last 1 year
        COALESCE(SUM(CASE WHEN created_at >= (CURRENT_DATE - INTERVAL '1 year') THEN amount END), 0) AS volume_1_year,
        COUNT(CASE WHEN created_at >= (CURRENT_DATE - INTERVAL '1 year') THEN transaction_hash END) AS txs_count_1_year,

        -- Transactions and volume in the last 1 week
        COALESCE(SUM(CASE WHEN created_at >= (CURRENT_DATE - INTERVAL '1 week') THEN amount END), 0) AS volume_1_week,
        COUNT(CASE WHEN created_at >= (CURRENT_DATE - INTERVAL '1 week') THEN transaction_hash END) AS txs_count_1_week,

        -- Transactions and volume for today
        COALESCE(SUM(CASE WHEN created_at >= CURRENT_DATE THEN amount END), 0) AS volume_today,
        COUNT(CASE WHEN created_at >= CURRENT_DATE THEN transaction_hash END) AS txs_count_today
    FROM filtered_transactions
)
SELECT * FROM aggregated;
`

    try {
        const result  = await pool.query(query, [user_id]);
        
        if (result.rows.length === 0) {
        //   return res.json({ message: "No data found" });
            return []
        }
        return result.rows
        
    } catch (error) {
        throw new Error("Unable to get data")
    }
}

const getUniqueAddressDetailsService = async (user_id, page = 1, limit = 10, search = '') => {
    const offset = (page - 1) * limit;
    const searchQuery = search ? `AND LOWER(from_wallet_address) ILIKE $4` : ''; 
    const params = search ? [user_id, limit, offset, `%${search.toLowerCase()}%`] : [user_id, limit, offset];

    const query = `WITH wallet_summary AS (
        SELECT 
            LOWER(from_wallet_address) AS from_wallet_address,
            COUNT(transaction_id) AS total_transactions, 
            SUM(amount) AS total_amount, 
            MAX(created_at) AS last_transaction_date,
            MIN(created_at) AS first_transaction_date
        FROM transactions
        WHERE status = 'completed'
        AND user_id = $1
        GROUP BY LOWER(from_wallet_address)
    )
    SELECT *, COUNT(*) OVER() AS total_count  
    FROM wallet_summary
    WHERE 1=1 ${searchQuery} 
    ORDER BY total_amount DESC
    LIMIT $2 OFFSET $3;`;

    try {
        const result = await pool.query(query, params);

        if(result.rows.length === 0){
            return []
        }
        // Extract total count from the first row, default to 0 if no results
        const totalCount = result.rows.length > 0 ? parseInt(result.rows[0].total_count) : 0;
        const pageCount = Math.ceil(totalCount / limit); // Calculate total pages

        return {
            page_count: totalCount,
            data: result.rows.map(row => {
                delete row.total_count; // Remove redundant field
                return row;
            })
        };
    } catch (error) {
        return {
            status: 500,
            success: false,
            message: "Unable to get data",
            page_count: 0,
            data: []
        };
    }
};



const editTransactionService = async(session_id, status) => {
    const updateQuery = `UPDATE transactions
                        SET status = $1
                        WHERE session_id = $2;`;
     try {
        const result  = await pool.query(updateQuery, [status ,session_id]);
        return result.rows;
        
    } catch (error) {
        console.log("error", error)
        throw new Error("Unable to update query")
    }
}

// Returns transaction details when users search using transaction_hash or wallet address.
const getTransactionByAddressORHashService = async(from_wallet_address, transaction_hash, page=1, limit=10,) => {
    const query = `SELECT *,COUNT(*) OVER() AS total_count FROM  transactions
	                WHERE transaction_hash = $1 or from_wallet_address = $2
                    ORDER BY created_at DESC
                    LIMIT $3 OFFSET $4;`;
     try {
        const offset = (page - 1) * limit;
        const result  = await pool.query(query, [transaction_hash, from_wallet_address, limit,offset]);
        const total_count = result.rows[0].total_count;
        const data = result.rows
        return {data, total_count};
        
    } catch (error) {
        console.log("error", error)
        throw new Error("Unable to update query")
    }
}

const getGraphTxsService = async(user_id) => {
    const query = `SELECT
    DATE(created_at) AS date, 
    COALESCE(SUM(amount), 0) AS total_volume,
    COUNT(transaction_hash) AS total_txs
FROM transactions
WHERE 
    (status = 'Completed' OR status = 'completed')  -- Ensure both statuses are grouped
    AND user_id = $1  -- Properly filter by user_id
    AND created_at >= (CURRENT_DATE - INTERVAL '1 month')  -- Filter by last 30 days
GROUP BY DATE(created_at)
ORDER BY DATE(created_at);`;

     try {
        const result  = await pool.query(query, [user_id]);
        console.log("result", result.rows)
        return result.rows;
        
    } catch (error) {
        console.log("error", error)
        throw new Error("Unable to update query")
    }
}

module.exports = { getRecentTransactionsService, getUserStatService, getUniqueAddressDetailsService, editTransactionService, getTransactionByAddressORHashService, getGraphTxsService};