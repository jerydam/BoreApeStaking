// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract BoreApeStaking is Ownable{ 
  uint256 constant SECONDS_PER_YEAR = 31536000;
    struct stakeID{
        uint256 stakedAmount;
        uint256 startTime;
        uint256 rewardAccrued;
        bool hasStake;
    }
    error tryAgain();
    address holder;
    IERC721 BoreApe;
    IERC20 USDT;

    constructor(){
        BoreApe = IERC721(0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D);
        USDT = IERC20(0xdAC17F958D2ee523a2206206994597C13D831ec7);
        holder = msg.sender;
    }
    mapping (address => stakeID)Stakers;
    modifier onlyHolder(){
        require(BoreApe.balanceOf(msg.sender) > 0,'not qualify to stake');
        _;
    }
    function stake(uint256 amount) onlyHolder external {
        stakeID storage _user = Stakers[msg.sender];
        uint256 _amount = _user.stakedAmount;

        USDT.transferFrom(msg.sender, address(this), amount);

        if (_amount == 0) {
            _user.stakedAmount = amount;
            _user.startTime = block.timestamp;
        } else {
            updateReward();
            _user.stakedAmount += amount;
        }
    }
    function calcReward() public view returns (uint256 _reward) {
        stakeID storage _user = Stakers[msg.sender];

        uint256 _amount = _user.stakedAmount;
        uint256 _startTime = _user.startTime;
        uint256 duration = block.timestamp - _startTime;

        _reward = (duration * 20 * _amount) / (SECONDS_PER_YEAR * 100);
    }
    function claimReward(uint256 amount) public {
        stakeID storage _user = Stakers[msg.sender];
        updateReward();
        uint256 _claimableReward = _user.rewardAccrued;
        require(_claimableReward >= amount, "insufficient funds");
        _user.rewardAccrued -= amount;
        if (amount >USDT.balanceOf(address(this))) revert tryAgain();
        USDT.transfer(msg.sender, amount);
    }
        function updateReward() public {
         stakeID storage _user = Stakers[msg.sender];
        uint256 _reward = calcReward();
        _user.rewardAccrued += _reward;
        _user.startTime = block.timestamp;
    }
       function withdraw(uint256 amount) public {
        stakeID storage _user = Stakers[msg.sender];
        uint256 staked = _user.stakedAmount;
        require(staked >= amount, "insufficient fund");
        updateReward();
        _user.stakedAmount -= amount;
        USDT.transfer(msg.sender, amount);
    }
     function closeAccount() external {
        stakeID storage _user = Stakers[msg.sender];
        uint256 staked = _user.stakedAmount;
        withdraw(staked);
        uint256 reward = _user.rewardAccrued;
        claimReward(reward);
    }

    function userInfo(address _user) external view returns (stakeID memory) {
        return Stakers[_user];
    }
    }

