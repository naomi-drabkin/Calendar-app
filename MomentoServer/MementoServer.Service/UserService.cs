﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MementoServer.Data.Repositories;
using MomentoServer.Core.DTOs.UsersDTOs;
using MomentoServer.Core.Entities;
using MomentoServer.Core.IRepositories;
using MomentoServer.Core.IServices;

namespace MementoServer.Service
{
    public class UserService : IUserService
    {


        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly ITokenService _tokenService;

        public UserService(IUserRepository userRepository, IMapper mapper, ITokenService tokenService)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _tokenService = tokenService;

        }

        public async Task<IEnumerable<DTOuser>> GetAllAsync()
        {
            var users = await _userRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<DTOuser>>(users);
        }

        public async Task<DTOuser> GetByIdAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            return _mapper.Map<DTOuser>(user);
        }

        public async Task<AuthResponse> Register(DTOregister userDto)
        {
            var existingUser = await _userRepository.GetByEmailAsync(userDto.Email);
            if (existingUser == null)
            {
                var userEntity = _mapper.Map<User>(userDto);
                userEntity.Role = userDto.Role;
                userEntity.Password = HashPassword(userDto.Password);
                await _userRepository.AddAsync(userEntity);
                return await Login(userEntity.Email, userEntity.Password);
            }
            return null;
        }

        public async Task<AuthResponse> Login(string email, string password)
        {
            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null)
            {
                return null;
            }

            //var userLogin = _userRepository.GetByEmailAsync(email);
            var token = _tokenService.GenerateToken(user);

            return new AuthResponse
            {
                Token = token,
                User = user
            };
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user != null)
            {
                var res = await _userRepository.DeleteUserAsync(id);
                return res ? true : false;
            }
            return false;
        }

        public async Task<bool> UpdateUserAsync(int id, DTOuser userDto)
        {
            var existingUser = await _userRepository.GetByIdAsync(id);
            if (existingUser != null)
            {

                var change = _mapper.Map<User>(userDto);
                change.Password = HashPassword(userDto.Password);
                var res = await _userRepository.UpdateUserAsync(id, change);

                return res ? true : false;
            }
            return false;
        }

        public static string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        public static bool VerifyPassword(string enteredPassword, string hashedPassword)
        {
            return BCrypt.Net.BCrypt.Verify(enteredPassword, hashedPassword);
        }
    }
}
