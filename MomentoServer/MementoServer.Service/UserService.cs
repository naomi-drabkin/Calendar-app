using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MementoServer.Data.Repositories;
using MomentoServer.Core.DTOs;
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

        public IEnumerable<DTOuser> GetAll()
        {
            var users = _userRepository.GetAll();
            return _mapper.Map<IEnumerable<DTOuser>>(users);
        }

        public DTOuser GetById(int id)
        {
            var user = _userRepository.GetById(id);
            return _mapper.Map<DTOuser>(user);
        }

        public bool Register(DTOregister userDto)
        {
            var existingUser = _userRepository.GetByEmail(userDto.Email);
            if (existingUser == null)
            {
                var userEntity = _mapper.Map<User>(userDto);
                userEntity.Role = "User";
                _userRepository.Add(userEntity);
                return true;
            }
            return false;
        }

        public AuthResponse Login(string email, string password)
        {
            var user = _userRepository.GetByEmail(email);
            var DTOuser = _mapper.Map<DTOuser>(user);
            if (user == null || user.Password != password)
            {
                return null;
            }


            var token = _tokenService.GenerateToken(DTOuser);
            return new AuthResponse
            {
                Token = token,
                User = _mapper.Map<DTOuser>(user)
            };
        }

        public bool DeleteUser(int id)
        {
            var user = _userRepository.GetById(id);
            if (user != null)
            {
                _userRepository.DeleteUser(id);
                return true;
            }
            return false;
        }

        public bool UpdateUser(int id, DTOuser userDto)
        {
            var existingUser = _userRepository.GetById(id);
            if (existingUser != null)
            {
                _mapper.Map(userDto, existingUser);
                _userRepository.UpdateUser(existingUser);
                return true;
            }
            return false;
        }

    }
}
